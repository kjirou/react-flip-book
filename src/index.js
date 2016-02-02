'use strict';

const FlipBook = require('./lib/react-flip-book');


/*
 * Generate transitions for react-flip-book
 * @param {Object} defaultProps
 * @param {Array<Object>} transitionDiffs
 * @return {Array<Object>}
 */
const generateTransitions = (defaultProps, transitionDiffs) => {
  let currentProps = Object.assign({}, defaultProps);
  return transitionDiffs.map(diff => {
    const duration = diff.duration || 0;
    const diffProps = {};
    Object.keys(diff).forEach(key => {
      if (key !== 'duration') {
        diffProps[key] = diff[key];
      }
    });
    currentProps = Object.assign({}, currentProps, diffProps, {
      duration,
    });
    return currentProps;
  });
};


FlipBook.generateTransitions = generateTransitions;

module.exports = FlipBook;
