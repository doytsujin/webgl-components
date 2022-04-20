import { WebGLRenderTarget, LinearFilter, NearestFilter, RGBFormat, UnsignedByteType } from 'three';

/**
 * Render target helper
 *
 * @export
 * @param {number} [width=1024]
 * @param {number} [height=1024]
 * @param {Object} [options={}]
 * @return {WebGLRenderTarget}
 */
export function createRenderTarget(width: number = 1024, height: number = 1024, options: Object = {}) {
    const defaults = {
        minFilter: LinearFilter,
        magFilter: NearestFilter,
        format: RGBFormat,
        type: UnsignedByteType,
        stencilBuffer: false
    };
    return new WebGLRenderTarget(width, height, Object.assign({}, defaults, options));
}