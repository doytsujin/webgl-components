import { PerspectiveCamera, Vector3 } from 'three';
/**
 * Position the camera and lookat the scene center
 *
 * @export
 * @param {PerspectiveCamera} camera
 * @param {number} [zoom=1]
 * @param {Vector3} [angle=VECTOR_ONE]
 */
export declare function positionCamera(camera: PerspectiveCamera, zoom?: number, angle?: Vector3): void;
