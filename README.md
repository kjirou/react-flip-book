# react-flip-book

[![npm version](https://badge.fury.io/js/react-flip-book.svg)](http://badge.fury.io/js/react-flip-book)

A React component for making state transition from a list of props

([日本語](https://github.com/kjirou/react-flip-book/blob/master/README.ja.md))



## Installation

It can not be used directly by the browser.

You need to use a bundler like [browserify](https://github.com/substack/node-browserify)/[webpack](https://github.com/webpack/webpack).

```bash
npm install --save react-flip-book
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

..then wrap by `FlipBook` meta-component with both `realProps` and `transition`.

```js
import FlipBook from 'react-flip-book';

const realProps = {
  color: 'black',
  message: 'Finish',
};

const transition = [
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

const transitionalMessage = <FlipBook realProps={ realProps } transition={ transition }>
  { props => <MyAwesomeMessage { ...props } /> }
</FlipBook>;
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


## Features

- Without changing the original components, you can apply a simple flip animation, such as a cartoon
- If you set `[]` to `transition`, that is same as normal rendering
