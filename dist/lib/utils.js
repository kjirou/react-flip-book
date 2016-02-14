'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.totalDurations = exports.alterTransition = exports.assertTransition = exports.generateTransition = undefined;

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Generate transition from prop-diffs
 * @param {Object} defaultProps
 * @param {Array<Object>} transitionDiffs
 * @return {Array<Object>}
 */
var generateTransition = exports.generateTransition = function generateTransition(defaultProps, transitionDiffs) {
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

var assertTransition = exports.assertTransition = function assertTransition(transition) {
  if (!Array.isArray(transition)) {
    throw new Error('A transition should be an array');
  }

  if (transition.some(function (props) {
    return typeof props.duration !== 'number';
  })) {
    throw new Error('A transition should include "duration" property for each item');
  }
};

/*
 * Alter a transition by any turning points containing keyframes
 *
 * Example 1:
 * ```
 * transition:
 *   [
 *     { duration:  50, icon: 'slash_1', hp: 3 },
 *     { duration: 100, icon: 'slash_2', hp: 3 },
 *     { duration:  50, icon: 'slash_1', hp: 3 },
 *   ]
 * alterations:
 *   [
 *     { keyframe: 75, hp: 2 },
 *   ]
 * result:
 *   [
 *     { duration: 50, icon: 'slash_1', hp: 3 },
 *     { duration: 25, icon: 'slash_2', hp: 3 },
 *     { duration: 75, icon: 'slash_2', hp: 2 },
 *     { duration: 50, icon: 'slash_1', hp: 2 },
 *   ]
 * ```
 *
 * Example 2:
 * ```
 * transition:
 *   [
 *     { duration:  50, icon: 'slash_1', hp: 3 },
 *     { duration: 100, icon: 'slash_2', hp: 1 },
 *     { duration:  50, icon: 'slash_1', hp: 1 },
 *   ]
 * alterations:
 *   [
 *     { keyframe: 75, hp: 2 },
 *   ]
 * result:
 *   [
 *     { duration: 50, icon: 'slash_1', hp: 3 },
 *     { duration: 25, icon: 'slash_2', hp: 1 },
 *     { duration: 75, icon: 'slash_2', hp: 2 },  // Ignore transition's hp after alteration applying
 *     { duration: 50, icon: 'slash_1', hp: 2 },
 *   ]
 * ```
 *
 * @return {Array<Object>}
 */
var alterTransition = exports.alterTransition = function alterTransition(transition, alterations) {
  assertTransition(transition);

  if (alterations.some(function (alteration) {
    return typeof alteration.keyframe !== 'number';
  })) {
    throw new Error('A alteration should include "keyframe" property for each item');
  }

  var keyframeObjects = [];
  var appendKeyframeObject = function appendKeyframeObject(keyframe, props, alteration) {
    keyframeObjects.push({
      keyframe: keyframe,
      props: props,
      alteration: alteration
    });
  };

  var endKeyframe = 0;
  transition.forEach(function (props) {
    appendKeyframeObject(endKeyframe, props, null);
    endKeyframe += props.duration;
  });

  // ensure that the last keyframe is props
  appendKeyframeObject(endKeyframe, null, null);

  alterations.filter(function (alteration) {
    return alteration.keyframe < endKeyframe;
  }).forEach(function (alteration) {
    var keyframeObjectOnTheSameFrame = keyframeObjects.filter(function (keyframeObject) {
      return keyframeObject.keyframe === alteration.keyframe;
    })[0];
    if (keyframeObjectOnTheSameFrame) {
      keyframeObjectOnTheSameFrame.alteration = alteration;
    } else {
      appendKeyframeObject(alteration.keyframe, null, alteration);
    }
  });

  keyframeObjects.sort(function (a, b) {
    return a.keyframe - b.keyframe;
  });

  var lastProps = {};
  var mergedAlternation = {};
  return keyframeObjects.map(function (keyframeObject, index) {
    var nextKeyframeObject = keyframeObjects[index + 1] || null;
    if (!nextKeyframeObject) {
      return null;
    }
    var duration = nextKeyframeObject.keyframe - keyframeObject.keyframe;

    if (keyframeObject.alteration) {
      Object.assign(mergedAlternation, (0, _lodash2.default)(keyframeObject.alteration, 'keyframe'));
    }

    var newProps = {};
    if (keyframeObject.props) {
      Object.assign(newProps, keyframeObject.props, mergedAlternation, { duration: duration });
    } else {
      Object.assign(newProps, lastProps, mergedAlternation, { duration: duration });
    }

    Object.assign(lastProps, newProps);

    return newProps;
  }).filter(function (keyframeObject) {
    return keyframeObject !== null;
  });
};

var totalDurations = exports.totalDurations = function totalDurations(transition) {
  assertTransition(transition);
  return transition.reduce(function (memo, props) {
    return memo + props.duration;
  }, 0);
};