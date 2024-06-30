var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const ApiError_1 = require("./core/ApiError");

var cors = require('cors');
const swaggerRoute_1 = require("./routes/swaggerRoute");
const AuthRoute = require("./routes/authRoute");
const ProviderRoute = require("./routes/providerRoute");
const indexRoute = require("./routes/index");
const { ApiResponse } = require('./core/ApiResponse');

class App {
  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {


    this.router = express.Router();

    //create express js application
    this.app = express();
    console.log(`Worker ${process.pid} started`);

    //configure application
    this.config();

    //add routes For Web APP
    this.web();

    //add api For Rest API
    this.api();

    // Error handling
    this.ErrorHandling();

    this.swagger();

    //use router middleware
    // this.app.use(this.router);
  }
  /**
   * Bootstrap the application.
   *Server
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  static bootstrap() {
    return new App();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  api() {
    new AuthRoute(this.router);
    new ProviderRoute(this.router);
    new indexRoute(this.router);

    //use router middleware
    this.app.use('/api', this.router);

    // const uploadsDirectory = path.join(__dirname, '../uploads/');
    this.app.use(express.static(path.join(__dirname, "uploads")));
    // console.log('Uploads Directory:', uploadsDirectory);
    this.app.use('/uploads', express.static('uploads'));
    // express.static('public')
  }

  swagger() {
    new swaggerRoute_1.SwaggerRoute(this.router);
    //use router middleware
    this.app.use('/', this.router);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  config() {
    this.app.use('/public', express.static('public'));

    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(async function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, crossdomain, withcredentials, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, TokenType");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
    this.app.use(cors({ origin: process.env.CORS_URL, optionsSuccessStatus: 200 }));
    //mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use((req, res, next) => {
      const start = Date.now();
      req.startTime = start
      next();
    });
  }

  ErrorHandling() {
    //error handling
    this.app.use((req, res, next) => next(new ApiError_1.NotFoundError()));
    // catch 404 and forward to error handler
    this.app.use((err, req, res, next) => {
      if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
      }
      else {
        if (process.env.NODE_ENV === 'development') {
          // Logger_1.default.error(err);
          return res.status(500).send(err.message);
        }
        ApiError_1.ApiError.handle(new ApiError_1.InternalError(), res);
      }
    });
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method web
   * @return void
   */
  web() {
    //IndexRoute 
    this.app.use('/', this.router);
  }
}

exports.App = App;