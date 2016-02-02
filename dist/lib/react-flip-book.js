'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var FlipBook = function (_React$Component) {
  _inherits(FlipBook, _React$Component);

  function FlipBook() {
    _classCallCheck(this, FlipBook);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlipBook).call(this));

    _this._isInTransition = false;
    return _this;
  }

  _createClass(FlipBook, [{
    key: '_runTransitions',
    value: function _runTransitions(transitions) {
      var _this2 = this;

      this._isInTransition = true;
      transitions = transitions.slice();

      Promise.resolve().then(function () {
        return transitions.reduce(function (lastPromise, transition) {
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
        // TODO: Restart, if (this.props.transitions.length > 0)
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
      if (this.props.transitions.length > 0) {
        this._runTransitions(this.props.transitions);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.transitions.length > 0) {
        this._runTransitions(nextProps.transitions);
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
}(React.Component);

Object.assign(FlipBook, {
  defaultProps: {
    realProps: {},
    transitions: []
  },
  propTypes: {
    children: React.PropTypes.func.isRequired,
    realProps: React.PropTypes.object,
    transitions: React.PropTypes.array
  }
});

module.exports = FlipBook;