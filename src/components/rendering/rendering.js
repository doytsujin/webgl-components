import { WebGLRenderer, Vector2 } from 'three';

/**
 * Compute the new width and height based on the maximum pixel resolution
 *
 * @param {number} baseSize
 * @param {number} windowWidth
 * @param {number} windowHeight
 * @returns {{ width: number, height: number }}
 */
function resize(baseSize: number, windowWidth: number, windowHeight: number): { width: number, height: number } {
  let width = windowWidth;
  let height = windowHeight;
  const maxSize = baseSize * baseSize;
  if (windowWidth * windowHeight > maxSize) {
    const ratio = height / width;
    width = baseSize;
    height = Math.floor(baseSize * ratio);
    let newSize = width * height;
    const scalar = Math.sqrt(maxSize / newSize);
    width = Math.floor(width * scalar);
    height = Math.floor(height * scalar);
  }
  return {
    width,
    height
  };
}

/**
 * Set the renderer size based on a max renderable resolution
 * Note this doesn't account for pixelRatio set with WebGLRenderer
 *
 * @export
 * @param {WebGLRenderer} renderer
 * @param {Vector2} maxResolution
 * @param {number} containerWidth
 * @param {number} containerHeight
 * @returns {{ width: Number, height: number }}
 */
export function setRendererSize(
  renderer: WebGLRenderer,
  maxResolution: Vector2,
  containerWidth: number,
  containerHeight: number
): { width: Number, height: number } {
  const baseSize = Math.sqrt(maxResolution.x * maxResolution.y);
  let { width, height } = resize(baseSize, containerWidth, containerHeight);
  renderer.setSize(width, height);
  renderer.domElement.style.width = `${containerWidth}px`;
  renderer.domElement.style.height = `${containerHeight}px`;
  return { width, height };
}
