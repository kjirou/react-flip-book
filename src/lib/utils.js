import omit from 'lodash.omit';


/*
 * Generate transition from prop-diffs
 * @param {Object} defaultProps
 * @param {Array<Object>} transitionDiffs
 * @return {Array<Object>}
 */
export const generateTransition = (defaultProps, transitionDiffs) => {
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

export const assertTransition = (transition) => {
  if (!Array.isArray(transition)) {
    throw new Error('A transition should be an array');
  }

  if (transition.some(props => typeof props.duration !== 'number')) {
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
export const alterTransition = (transition, alterations) => {
  assertTransition(transition);

  if (alterations.some(alteration => typeof alteration.keyframe !== 'number')) {
    throw new Error('A alteration should include "keyframe" property for each item');
  }

  const keyframeObjects = [];
  const appendKeyframeObject = (keyframe, props, alteration) => {
    keyframeObjects.push({
      keyframe,
      props,
      alteration,
    });
  };

  let endKeyframe = 0;
  transition.forEach(props => {
    appendKeyframeObject(endKeyframe, props, null);
    endKeyframe += props.duration;
  });

  // ensure that the last keyframe is props
  appendKeyframeObject(endKeyframe, null, null);

  alterations
    .filter(alteration => alteration.keyframe < endKeyframe)
    .forEach(alteration => {
      const keyframeObjectOnTheSameFrame = keyframeObjects.filter(keyframeObject => {
        return keyframeObject.keyframe === alteration.keyframe;
      })[0];
      if (keyframeObjectOnTheSameFrame) {
        keyframeObjectOnTheSameFrame.alteration = alteration;
      } else {
        appendKeyframeObject(alteration.keyframe, null, alteration);
      }
    })
  ;

  keyframeObjects.sort((a, b) => a.keyframe - b.keyframe);

  const lastProps = {};
  const mergedAlternation = {};
  return keyframeObjects
    .map((keyframeObject, index) => {
      const nextKeyframeObject = keyframeObjects[index + 1] || null;
      if (!nextKeyframeObject) {
        return null;
      }
      const duration = nextKeyframeObject.keyframe - keyframeObject.keyframe;

      if (keyframeObject.alteration) {
        Object.assign(mergedAlternation, omit(keyframeObject.alteration, 'keyframe'));
      }

      const newProps = {};
      if (keyframeObject.props) {
        Object.assign(newProps, keyframeObject.props, mergedAlternation, { duration });
      } else {
        Object.assign(newProps, lastProps, mergedAlternation, { duration });
      }

      Object.assign(lastProps, newProps);

      return newProps;
    })
    .filter(keyframeObject => keyframeObject !== null)
  ;
};

export const totalDurations = (transition) => {
  assertTransition(transition);
  return transition.reduce((memo, props) => { return memo + props.duration; }, 0);
};
