// Helpers for the home page background tests (D015).

/** A hardware renderer's name, for tests that need the background to animate. */
export const GPU =
  'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)'

/**
 * Makes WebGL report `name` as its renderer; runs in the page before its
 * scripts. Without a GPU, browsers in tests shade on the CPU, where the
 * background draws one still frame.
 */
export function fakeRenderer(name: string) {
  const { getParameter } = WebGL2RenderingContext.prototype
  WebGL2RenderingContext.prototype.getParameter = function (pname: number) {
    // RENDERER, and UNMASKED_RENDERER_WEBGL from WEBGL_debug_renderer_info.
    return pname === 0x1f01 || pname === 0x9246
      ? name
      : getParameter.call(this, pname)
  }
}
