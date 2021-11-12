'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var three = require('three');

const VECTOR_ZERO = new three.Vector3();
const VECTOR_ONE = new three.Vector3(1, 1, 1);
new three.Vector3(0, 1, 0);

/**
 * Position the camera and lookat the scene center
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @param {number} [zoom=1]
 * @param {Vector3} [angle=VECTOR_ONE]
 */

function positionCamera(camera, zoom = 1, angle = VECTOR_ONE) {
  camera.position.set(angle.x * zoom, angle.y * zoom, angle.z * zoom);
  camera.lookAt(VECTOR_ZERO);
}

var cameras = /*#__PURE__*/Object.freeze({
  __proto__: null,
  positionCamera: positionCamera
});

exports.cameras = cameras;
