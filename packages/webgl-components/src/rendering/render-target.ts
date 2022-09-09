import { WebGLRenderTarget, LinearFilter, NearestFilter, RGBAFormat, UnsignedByteType } from 'three';

/**
 * Render target helper
 *
 * @export
 * @param {number} [width=1024]
 * @param {number} [height=1024]
 * @param {Object} [options={}]
 * @return {WebGLRenderTarget}
 */
export function createRenderTarget(width = 1024, height = 1024, options: Record<string, unknown> = {}) {
  const defaults = {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    type: UnsignedByteType,
    stencilBuffer: false
  };
  return new WebGLRenderTarget(width, height, Object.assign({}, defaults, options));
}
