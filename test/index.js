'use strict';

const assert = require('assert');

const FlipBook = require('../src').default;
const generateTransition = require('../src').generateTransition;
const alterTransition = require('../src').alterTransition;


describe('react-flip-book', () => {

  describe('FlipBook', () => {

    it('should be', () => {
      assert(typeof FlipBook, 'function');
    });
  });

  describe('generateTransition', () => {

    it('simple use', () => {
      assert.deepEqual(
        generateTransition(
          {
            x: 1,
            y: 2,
            z: 0,
          },
          [
            { x: 2 },
            { z: 10 },
          ]
        ),
        [
          {
            duration: 0,
            x: 2,
            y: 2,
            z: 0,
          },
          {
            duration: 0,
            x: 2,
            y: 2,
            z: 10,
          },
        ]
      );
    });

    it('should set duration', () => {
      assert.deepEqual(
        generateTransition(
          {
            x: 1,
            y: 2,
          },
          [
            { duration: 100 },
            { duration: 0 },
            { duration: 200 },
          ]
        ),
        [
          {
            duration: 100,
            x: 1,
            y: 2,
          },
          {
            duration: 0,
            x: 1,
            y: 2,
          },
          {
            duration: 200,
            x: 1,
            y: 2,
          },
        ]
      );
    });

    it('complex use', () => {
      assert.deepEqual(
        generateTransition(
          {
            x: 1,
            y: 2,
            ary: [11, 22],
            obj: { a: 111, b: 222 },
            foo: null,
            bar: undefined,
          },
          [
            {
              duration: 200,
              ary: [33],
            },
            {
              duration: 100,
              ary: [44],
              obj: { a: 333, b: null },
              bar: null,
            },
          ]
        ),
        [
          {
            duration: 200,
            x: 1,
            y: 2,
            ary: [33],
            obj: { a: 111, b: 222 },
            foo: null,
            bar: undefined,
          },
          {
            duration: 100,
            x: 1,
            y: 2,
            ary: [44],
            obj: { a: 333, b: null },
            foo: null,
            bar: null,
          },
        ]
      );
    });
  });


  describe('alterTransition', () => {

    it('should be', () => {
      const transition = [
        {
          duration: 50,
          x: 1,
          y: 10,
        },
        {
          duration: 100,
          x: 2,
          y: 20,
        },
      ];
      const alterations = [
        {
          keyframe: 75,
          y: 21,
        },
      ];

      const actual = alterTransition(transition, alterations);
      assert.deepEqual(actual, [
        {
          duration: 50,
          x: 1,
          y: 10,
        },
        {
          duration: 25,
          x: 2,
          y: 20,
        },
        {
          duration: 75,
          x: 2,
          y: 21,
        },
      ]);
    });

    it('alterations are continuous at the tail', () => {
      const transition = [
        {
          duration: 100,
          x: 1,
          y: 2,
        },
      ];
      const alterations = [
        {
          keyframe: 25,
          y: 3,
        },
        {
          keyframe: 75,
          y: 4,
        },
      ];

      const actual = alterTransition(transition, alterations);
      assert.deepEqual(actual, [
        {
          duration: 25,
          x: 1,
          y: 2,
        },
        {
          duration: 50,
          x: 1,
          y: 3,
        },
        {
          duration: 25,
          x: 1,
          y: 4,
        },
      ]);
    });

    it('should ignore keyframes outside the durations', () => {
      const transition = [
        {
          duration: 100,
          x: 1,
          y: 2,
        },
      ];
      const alterations = [
        {
          keyframe: 99,
          y: 3,
        },
        {
          keyframe: 100,
          y: 4,
        },
      ];

      const actual = alterTransition(transition, alterations);
      assert.deepEqual(actual, [
        {
          duration: 99,
          x: 1,
          y: 2,
        },
        {
          duration: 1,
          x: 1,
          y: 3,
        },
      ]);
    });
  });
});
