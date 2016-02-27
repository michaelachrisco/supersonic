'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _isomorphicRelayRouter = require('isomorphic-relay-router');

var _isomorphicRelayRouter2 = _interopRequireDefault(_isomorphicRelayRouter);

var _reactRouter = require('react-router');

var _isomorphicRelay = require('isomorphic-relay');

var _isomorphicRelay2 = _interopRequireDefault(_isomorphicRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = require(process.cwd() + '/build/config/routes').default;

exports.default = function (ctx, next) {
  return new Promise(function (resolve, reject) {
    (0, _reactRouter.match)({ routes: routes, location: ctx.url }, function (error, redirectLocation, renderProps) {
      if (error) {
        ctx.status = 500;
        ctx.body = error.message;
        resolve();
      } else if (renderProps) {
        _isomorphicRelayRouter2.default.prepareData(renderProps).then(render).catch(function (ex) {
          var env = process.env.NODE_ENV;
          if (env && env === 'production') {
            ctx.response.status = 500;
            ctx.body = 'Uh oh, errors';
          } else if (env != 'test') {
            console.log(ex);
            ctx.res.writeHead(200, { 'Content-Type': 'text/html' });
            ctx.res.end(renderDevError(ex));
          }
          resolve();
        });
      } else {
        ctx.status = 404;
        ctx.body = 'Not Found';
        resolve();
      }

      function render(_ref) {
        var data = _ref.data;
        var props = _ref.props;

        var html = _server2.default.renderToString(_react2.default.createElement(_isomorphicRelayRouter2.default.RouterContext, props)),
            renderedPage = renderPage({ content: html, title: 'SS Demo', preloadedData: data });

        ctx.status = 200;
        ctx.body = renderedPage;
        resolve();
      }
    });
  });
};

function renderPage(props) {
  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width">\n        <link href="http://localhost:8080/js/styles.css" rel="stylesheet" />\n        <title>' + props.title + '</title>\n      </head>\n      <body>\n        <div id="app">' + props.content + '</div>\n        <script id="preloadedData" type="application/json">' + JSON.stringify(props.preloadedData) + '</script>\n        <script src="http://localhost:8080/js/app.js"></script>\n      </body>\n    </html>\n  ';
}

function renderDevError(props) {
  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <meta charset="utf-8">\n        <meta name="viewport" content="width=device-width">\n        <title>FermentAble</title>\n      </head>\n      <body>\n        <div id="app">\n          <h1>' + props.name + ': ' + props.message + '</h1>\n          <p>In: ' + props.fileName + ' at line ' + props.lineNumber + '</p>\n          <p>Stack: ' + props.stack + '</p>\n        </div>\n      </body>\n    </html>\n  ';
}