const nodemailer = require('nodemailer');
const { dbReader, dbWriter } = require('./../models/dbconfig');
const fromDisplayName = 'Kukwo';
const S = require('string');
const Bluebird = require('bluebird');
class NodeMailerController {

  // Email Template Convert Function
  async ConvertData(ReqData, callback) {
    console.log(ReqData);
    if (ReqData.templateIdentifier != 0) {
      var getEmailTemplate = await dbReader.emailDesignTemplate.findOne({
        where: { email_design_template_id: ReqData.templateIdentifier }
      });
      getEmailTemplate = JSON.parse(JSON.stringify(getEmailTemplate));
      if (getEmailTemplate) {
        var mainData = getEmailTemplate.template_html_text;
        ReqData.subjectMail = getEmailTemplate.subject;
        var promiseWhile = async function (condition, action) {
          var resolver = Bluebird.defer();
          var loop = function () {
            if (!condition()) return resolver.resolve();
            return Bluebird.cast(action())
              .then(loop)
              .catch(resolver.reject);
          };
          process.nextTick(loop);
          return resolver.promise;
        };

        // $ Variable $
        var gv = [];
        const regex = /\$([0-9a-zA-Z-_\/\']+)\$/gm;
        let s;
        while ((s = regex.exec(getEmailTemplate.template_html_text)) !== null) {
          if (s.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          gv.push(s[0]);
        }
        var gvCount = 0, stop = gv.length, gvd = {};
        await promiseWhile(function () {
          return gvCount < stop;
        }, function () {
          var cntData = gv[gvCount++];
          return new Promise(async function (resolve, reject) {
            switch (cntData) {
              case '$ChangePasswordLink$':
                gvd[cntData] = ReqData.redirect_url;
                resolve(true);
                break;

              case '$email_otp$':
                gvd[cntData] = ReqData.email_otp;
                resolve(true);
                break;
              default:
                resolve(true);
            }
          });
        }).then(async function () {
          var dts = mainData;
          Object.keys(gvd).forEach(function (key) {
            if (!gvd[key]) gvd[key] = "";
            gvd[key] = S(gvd[key]).unescapeHTML().s
            dts = S(dts).replaceAll(key, S(gvd[key]).escapeHTML().s).s;
          });
          ReqData.htmlContent = S(dts).unescapeHTML().s;

          // Getting mail server 
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_USERNAME, //'dadhich@differenzsystem.com',
              pass: process.env.EMAIL_PASSWORD//'md-QfLKfs1OZBdJsB_6SaXFog'
            }
          });

          const mailOptions = {
            from: '',
            // to: 'deep.panchal@differenzsystem.com',
            to: ReqData.email,
            // subject: 'Test Email',
            subject: ReqData.subjectMail,
            html: ReqData.htmlContent
          };


          // send email using nodemailer transporter
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });
      } else {
        console.log("Email Template Not Found.");
      }
    } else {
      console.log("Method Not Found.");
    }
  }

  async sendDirectMail(ReqData) {
    try {
      var body = {
        status: 1,
        user_id: ReqData.user_id,
        email_design_template_id: ReqData.templateIdentifier,
        subject_mail: ReqData.subjectMail,
        site: ReqData.site,
        receiver: ReqData.user_email,
        htmlContent: ReqData.htmlContent,
        global_id: (ReqData.userOrderId) ? ReqData.userOrderId : 0,
        parent_id: (ReqData.parent_id) ? ReqData.parent_id : 0,
      };
      ReqData.body = body;

      var server = {}, ObjectArray = {};
      // Getting mail server 
      var emailService = await dbReader.siteEmailServices.findOne({
        where: {
          site_id: ReqData.site,
          is_deleted: 0,
        },
        order: [['site_email_service_id', 'DESC']]
      });
      emailService = JSON.parse(JSON.stringify(emailService));
      var getHtmlContent = new sendEmailLogsController();
      if (emailService) {
        var cntData = emailService.email_service_id;
        ReqData.body.site_email_service_id = emailService.site_email_service_id
        switch (cntData) {
          // getting email_service_id to send mail through enum
          case EnumObject.emailServerIdEnum.get('aws').value:
            var getEmailServiceData = JSON.parse(emailService.service_type_credentials);
            break;
          case EnumObject.emailServerIdEnum.get('gmail').value:
            var getEmailServiceData = JSON.parse(emailService.service_type_credentials);
            server = getEmailServiceData;
            ObjectArray = {
              from: {
                name: fromDisplayName,
                address: getEmailServiceData.auth.user
              },
              to: ReqData.user_email,
              subject: ReqData.subjectMail,
              html: ReqData.htmlContent
            };
            ReqData.body.sender = getEmailServiceData.auth.user
            break;
          case EnumObject.emailServerIdEnum.get('smtp').value:
            var getEmailServiceData = JSON.parse(emailService.service_type_credentials);
            delete getEmailServiceData.serviceProvider
            server = getEmailServiceData;
            ObjectArray = {
              from: {
                name: fromDisplayName,
                address: getEmailServiceData.auth.user
              },
              to: ReqData.user_email,
              subject: ReqData.subjectMail,
              html: ReqData.htmlContent
            };
            ReqData.body.sender = getEmailServiceData.auth.user
            break;
          default:
            break;
        }
        let transporter = await nodemailer.createTransport(server);
        transporter.sendMail(ObjectArray, async function (error, info) {
          if (error) {
            console.log(error);
            body.status = 0;
            //ReqData.body['response_data'] = JSON.stringify(error);
            ReqData.body.response_data = JSON.stringify(error);
            await getHtmlContent.uploadDataToAWSBucket(ReqData);
          } else {
            ReqData.body.response_data = JSON.stringify(info);
            await getHtmlContent.uploadDataToAWSBucket(ReqData);
          }
        });
      } else {
        body.status = 0;
        await getHtmlContent.uploadDataToAWSBucket(ReqData);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
module.exports = NodeMailerController;
