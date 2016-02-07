# react-flip-book

[![npm version](https://badge.fury.io/js/react-flip-book.svg)](http://badge.fury.io/js/react-flip-book)

A React component for making state transition from a list of props

([English](https://github.com/kjirou/react-flip-book))


## インストール

直接ブラウザから読み込むことはできません。

[browserify](https://github.com/substack/node-browserify) や [webpack](https://github.com/webpack/webpack) などを使って下さい。


```bash
npm install --save react-flip-book
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

以下のように、メタな `FlipBook` コンポーネントで対象コンポーネントを包みます。

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
- `transition` に渡す値を `[]` にすれば、通常の描画処理と全く同じになります。
