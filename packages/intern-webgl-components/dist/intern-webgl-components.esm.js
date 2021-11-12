import { Vector3 } from 'three';

const VECTOR_ZERO = new Vector3();
const VECTOR_ONE = new Vector3(1, 1, 1);
new Vector3(0, 1, 0);

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

export { cameras };
