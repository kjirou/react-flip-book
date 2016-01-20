class LateArrival extends React.Component {

  constructor() {
    super();

    this._isInTransition = false;
  }

  _runTransitions(transitions) {
    this._isInTransition = true;
    transitions = transitions.slice();

    Promise.resolve()
      .then(() => {
        return transitions.reduce((lastPromise, transition) => {
          // TODO: Could not transpile by babel@6.3.13
          //const {
          //  duration = 0,
          //  ...transitionalProps,
          //} = transition;
          const duration = transition.duration || 0;
          const transitionalProps = {};
          Object.keys(transition).forEach(key => {
            if (key !== 'duration') {
              transitionalProps[key] = transition[key];
            }
          });

          return lastPromise
            .then(() => {
              return new Promise(resolve => {
                this.setState({ transitionalProps });
                this.forceUpdate();
                setTimeout(resolve, duration);
              });
            })
          ;
        }, Promise.resolve());
      })
      .then(() => {
        // TODO: Restart, if (this.props.transitions.length > 0)
        this.setState({ transitionalProps: this.props.realProps });
        this.forceUpdate();
        this._isInTransition = false;
      })
      .catch(err => console.error(err))
    ;
  }

  componentDidMount() {
    if (this.props.transitions.length > 0) {
      this._runTransitions(this.props.transitions);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transitions.length > 0) {
      this._runTransitions(nextProps.transitions);
    }
  }

  shouldComponentUpdate() {
    return !this._isInTransition;
  }

  render() {
    const actualProps = this._isInTransition ? this.state.transitionalProps : this.props.realProps;
    return this.props.children(actualProps);
  }
}

Object.assign(LateArrival, {
  defaultProps: {
    realProps: {},
    transitions: [],
  },
  propTypes: {
    children: React.PropTypes.func.isRequired,
    realProps: React.PropTypes.object,
    transitions: React.PropTypes.array,
  },
});

module.exports = LateArrival;
