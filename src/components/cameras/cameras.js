import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, WebGLRenderer, Vector3 } from 'three';
import { VECTOR_ZERO, VECTOR_ONE } from '../math/math';

/**
 * Utility for creating a perspective camera
 *
 * @export
 * @returns
 */
export function createPerspectiveCamera(aspect: number): PerspectiveCamera {
  return new PerspectiveCamera(65, aspect, 0.1, 1000);
}

/**
 * Utility for creating orbit controls
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @returns
 */
export function createOrbitControls(camera: PerspectiveCamera, renderer: WebGLRenderer): OrbitControls {
  return new OrbitControls(camera, renderer.domElement);
}

/**
 * Position the camera and lookat the scene center
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @param {number} [zoom=1]
 * @param {Vector3} [angle=VECTOR_ONE]
 */
export function positionCamera(camera: PerspectiveCamera, zoom: number = 1, angle: Vector3 = VECTOR_ONE) {
  camera.position.set(angle.x * zoom, angle.y * zoom, angle.z * zoom);
  camera.lookAt(VECTOR_ZERO);
}
