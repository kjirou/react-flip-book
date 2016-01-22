# react-late-arrival

[![npm version](https://badge.fury.io/js/react-late-arrival.svg)](http://badge.fury.io/js/react-late-arrival)

A React component for making transitions to the real state


## Installation

It can not be used directly by the browser.

You need to use a bundler like [browserify](https://github.com/substack/node-browserify)/[webpack](https://github.com/webpack/webpack).

```bash
npm install --save react-late-arrival
```


## Usage

If you animate this component..

```js
import React from 'react';

class MyAwesomeMessage extends React.Component {
  render() {
    return <div style={ { color: this.props.color } }>{ this.props.message }</div>;
  }
}
```

..then wrap by `LateArrival` meta-component with both `realProps` and `transitions`.

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

const transitionalMessage = <LateArrival realProps={ realProps } transitions={ transitions }>
  { props => <MyAwesomeMessage { ...props } /> }
</LateArrival>;
```

In this case, the component will change like this:

```
1. red "One"
  |
(1000ms)
  |
2. green "Two"
  |
(500ms)
  |
3. blue "Three"
  |
(250ms)
  |
4. black "Finish"
```


## Feature

Without changing the original components, you can apply a simple flip animation, such as a cartoon.
