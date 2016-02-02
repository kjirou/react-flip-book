'use strict';

var FlipBook = require('./lib/react-flip-book');

/*
 * Generate transitions for react-flip-book
 * @param {Object} defaultProps
 * @param {Array<Object>} transitionDiffs
 * @return {Array<Object>}
 */
var generateTransitions = function generateTransitions(defaultProps, transitionDiffs) {
  var currentProps = Object.assign({}, defaultProps);
  return transitionDiffs.map(function (diff) {
    var duration = diff.duration || 0;
    var diffProps = {};
    Object.keys(diff).forEach(function (key) {
      if (key !== 'duration') {
        diffProps[key] = diff[key];
      }
    });
    currentProps = Object.assign({}, currentProps, diffProps, {
      duration: duration
    });
    return currentProps;
  });
};

FlipBook.generateTransitions = generateTransitions;

module.exports = FlipBook;