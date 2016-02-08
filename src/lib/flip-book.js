import React, { Component } from 'react';

import { assertTransition } from './utils';


export default class FlipBook extends Component {

  constructor() {
    super();

    this._isInTransition = false;
  }

  _runTransitions(transition) {
    this._isInTransition = true;
    transition = transition.slice();

    Promise.resolve()
      .then(() => {
        return transition.reduce((lastPromise, transition) => {
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
        // TODO: Restart, if (this.props.transition.length > 0)
        this.setState({ transitionalProps: this.props.realProps });
        this.forceUpdate();
        this._isInTransition = false;
      })
      .catch(err => console.error(err))
    ;
  }

  componentDidMount() {
    if (this.props.transition.length > 0) {
      this._runTransitions(this.props.transition);
    }
  }

  componentWillUpdate(nextProps) {
    assertTransition(nextProps.transition || []);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transition.length > 0) {
      this._runTransitions(nextProps.transition);
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

Object.assign(FlipBook, {
  defaultProps: {
    realProps: {},
    transition: [],
  },
  propTypes: {
    children: React.PropTypes.func.isRequired,
    realProps: React.PropTypes.object,
    transition: React.PropTypes.array,
  },
});
