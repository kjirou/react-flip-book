# react-late-arrival

[![npm version](https://badge.fury.io/js/react-late-arrival.svg)](http://badge.fury.io/js/react-late-arrival)

A React component for making transitions to the real state

([English](https://github.com/kjirou/react-late-arrival))


## インストール

直接ブラウザから読み込むことはできません。

[browserify](https://github.com/substack/node-browserify) や [webpack](https://github.com/webpack/webpack) などを使って下さい。


```bash
npm install --save react-late-arrival
```


## 使い方

例えば、このコンポーネントを動かしたい場合、

```js
import React from 'react';

class MyAwesomeMessage extends React.Component {
  render() {
    return <div style={ { color: this.props.color } }>{ this.props.message }</div>;
  }
}
```

以下のように、メタな `LateArrival` コンポーネントで対象コンポーネントを包みます。

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

この場合、`MyAwesomeMessage` の要素は、以下の様にアニメーションします。

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


## 特徴

- アニメーション対象であるコンポーネントの設計を修正する必要がありません。
- `transitions` に渡す値を `[]` にすれば、通常の描画処理と全く同じになります。
