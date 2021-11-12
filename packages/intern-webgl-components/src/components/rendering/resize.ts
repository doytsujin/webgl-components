import { WebGLRenderer, Vector2 } from 'three';

/**
 * Compute the new width and height based on the squared maximum pixel resolution
 *
 * @param {number} windowWidth
 * @param {number} windowHeight
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @return {*}  {{ width: number, height: number }}
 */
export function resizeWithConstraint(
  windowWidth: number,
  windowHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number, height: number } {
  const baseSize = Math.sqrt(maxWidth * maxHeight);
  const maxSize = baseSize * baseSize;
  let width = windowWidth;
  let height = windowHeight;
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
 * @param {number} windowWidth
 * @param {number} windowHeight
 * @param {number} maxWidth
 * @param {number} maxHeight
 */
export function setRendererSize(renderer: WebGLRenderer,  windowWidth: number, windowHeight: number, maxWidth: number, maxHeight: number) {
  let { width, height } = resizeWithConstraint(windowWidth, windowHeight, maxWidth, maxHeight);
  renderer.setSize(width, height);
  renderer.domElement.style.width = `${windowWidth}px`;
  renderer.domElement.style.height = `${windowHeight}px`;
}
