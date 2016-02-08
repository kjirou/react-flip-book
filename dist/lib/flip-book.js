'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlipBook = function (_Component) {
  _inherits(FlipBook, _Component);

  function FlipBook() {
    _classCallCheck(this, FlipBook);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlipBook).call(this));

    _this._isInTransition = false;
    return _this;
  }

  _createClass(FlipBook, [{
    key: '_runTransitions',
    value: function _runTransitions(transition) {
      var _this2 = this;

      this._isInTransition = true;
      transition = transition.slice();

      Promise.resolve().then(function () {
        return transition.reduce(function (lastPromise, transition) {
          var duration = transition.duration || 0;
          var transitionalProps = {};
          Object.keys(transition).forEach(function (key) {
            if (key !== 'duration') {
              transitionalProps[key] = transition[key];
            }
          });

          return lastPromise.then(function () {
            return new Promise(function (resolve) {
              _this2.setState({ transitionalProps: transitionalProps });
              _this2.forceUpdate();
              setTimeout(resolve, duration);
            });
          });
        }, Promise.resolve());
      }).then(function () {
        // TODO: Restart, if (this.props.transition.length > 0)
        _this2.setState({ transitionalProps: _this2.props.realProps });
        _this2.forceUpdate();
        _this2._isInTransition = false;
      }).catch(function (err) {
        return console.error(err);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.transition.length > 0) {
        this._runTransitions(this.props.transition);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      (0, _utils.assertTransition)(nextProps.transition || []);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.transition.length > 0) {
        this._runTransitions(nextProps.transition);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return !this._isInTransition;
    }
  }, {
    key: 'render',
    value: function render() {
      var actualProps = this._isInTransition ? this.state.transitionalProps : this.props.realProps;
      return this.props.children(actualProps);
    }
  }]);

  return FlipBook;
}(_react.Component);

exports.default = FlipBook;

Object.assign(FlipBook, {
  defaultProps: {
    realProps: {},
    transition: []
  },
  propTypes: {
    children: _react2.default.PropTypes.func.isRequired,
    realProps: _react2.default.PropTypes.object,
    transition: _react2.default.PropTypes.array
  }
});