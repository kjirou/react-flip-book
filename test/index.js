'use strict';

const assert = require('assert');
const React = require('react');
const Component = React.Component;
const ReactDOMServer = require('react-dom/server');

const LateArrival = require('../src/index');


describe('react-late-arrival', () => {

  it('should be', done => {
    class Foo extends Component {
      render() {
        return React.createElement('div', {}, this.props.x);
      }
    }

    const props = {
      realProps: {
        x: 3,
      },
      transitions: [
        { duration:  500, x: 1 },
        { duration: 12500, x: 2 },
      ],
    };

    const root = React.createElement(LateArrival, props, (props) => {
      return React.createElement(Foo, props);
    });
    let output = ReactDOMServer.renderToStaticMarkup(root);
    console.log(output);

    // TODO: サーバーサイドだとライフサイクルの解釈が違う？
    //       いずれにせよ、諦めてE2Eにした方がいいかも
    //setTimeout(() => {
    //  const output = ReactDOMServer.renderToStaticMarkup(root);
    //  console.log(output);
    //  done();
    //}, 1500);
  });
});
