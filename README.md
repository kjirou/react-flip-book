# react-late-arrival

[![npm version](https://badge.fury.io/js/react-late-arrival.svg)](http://badge.fury.io/js/react-late-arrival)

A React component for making transitions to the real state


## Installation

It can not be used directly by the browser.
You need to use a bundler like [browserify](https://github.com/substack/node-browserify)/[webpack](https://github.com/webpack/webpack).

```bash
npm install --save react-late-arrival
```


## Goal


## Usage

```js
import React from 'react';

class ColoredMessage extends React.Component {
  render() {
    return <div style={ { color: this.props.color } }>{ this.props.message }</div>;
  }
}
```

```js
const message = <ColoredMessage color="black" message="hello, black" />;
```

```js
import LateArrival from 'react-late-arrival';

const realProps = {
  color: 'black',
  message: 'Finish',
};

const transitions = [
  {
    duration: 1000,
    color: 'red',
    message: 'One',
  },
  {
    duration: 500,
    color: 'green',
    message: 'Two',
  },
  {
    duration: 250,
    color: 'blue',
    message: 'Three',
  },
];

const transitionalMessage = <LateArrival>
  { props => <ColoredMessage { ...props } /> }
</LateArrival>;
```
