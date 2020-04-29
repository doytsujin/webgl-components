import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, WebGLRenderer } from 'three';

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
