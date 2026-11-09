// The home page background (D015): WebGL2 shades one full-screen triangle
// with soft, slowly drifting glows. The CSS gradients under the canvas show
// until the first frame, and stay when WebGL2 is missing, the shaders fail
// to link or the context is lost; none of these throws or logs an error.
// Reduced motion, and a renderer that shades on the CPU, get the first frame
// only; a fine pointer moves the glows a little. The loop runs at up to 30
// frames a second while the page and the canvas are in view, and stops at the
// current frame if the device keeps missing that pace.
import vertexSource from './shaders/background.vert.glsl?raw'
import fragmentSource from './shaders/background.frag.glsl?raw'

/** Backbuffer budget in pixels; the scale also stays at or under one pixel per CSS pixel. */
const MAX_PIXELS = 200_000
/** Smallest backbuffer scale: upscaled further, the dither smears and banding shows. */
const MIN_SCALE = 0.5

/**
 * Renderers that shade on the CPU, where one frame takes tens of
 * milliseconds: Chrome's SwiftShader, Mesa's llvmpipe and softpipe, and
 * Windows' Basic Render Driver (WARP).
 */
const SOFTWARE = /SwiftShader|llvmpipe|softpipe|Basic Render|Software/i

/** Shortest time between frames: 30 a second, less 2 ms for timer jitter. */
const FRAME_TIME = 1000 / 30 - 2
/** Longest step of animation per frame, in seconds, so a stall never jumps the glows. */
const MAX_STEP = 0.1
/**
 * A frame later than this many milliseconds is slow: under 20 a second. It
 * sits between three and four 60 Hz intervals (50 and 66.7 ms) and between
 * six and seven 120 Hz ones (50 and 58.3 ms), so a steady 20 fps never
 * straddles it...
 */
const SLOW_FRAME = 54
/** ...and this many slow frames in a row stop the loop for good. */
const SLOW_FRAMES = 10

/** How far the pointer moves the glows, as a fraction of the canvas from its centre to an edge. */
const POINTER_REACH = 0.08
/** Time constant of the glows following the pointer, in seconds. */
const POINTER_LAG = 0.8

/** Shader colours and the tokens in tokens.css they come from. */
const COLORS = {
  u_base: '--color-backdrop',
  u_tint: '--color-backdrop-tint',
  u_strong: '--color-backdrop-strong',
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = matchMedia('(hover: hover) and (pointer: fine)')

/** Runs a startup step while the main thread is idle, so no step lengthens a task. */
function idle(step: () => void): void {
  if (typeof requestIdleCallback === 'function')
    requestIdleCallback(step, { timeout: 1000 })
  else setTimeout(step, 1)
}

/** Whether the context shades on the CPU, going by its renderer's name. */
function isSoftware(gl: WebGL2RenderingContext): boolean {
  // Chrome and Safari mask RENDERER and name the renderer only through the
  // debug extension; Firefox names it in RENDERER and warns when the
  // extension is asked for.
  let name = String(gl.getParameter(gl.RENDERER))
  if (name === 'WebKit WebGL') {
    const debug = gl.getExtension('WEBGL_debug_renderer_info')
    if (debug) name = String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
  }
  return SOFTWARE.test(name)
}

export function mountBackground(canvas: HTMLCanvasElement): void {
  idle(() => {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (gl) run(canvas, gl)
    else canvas.remove()
  })
}

function run(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): void {
  const software = isSoftware(gl)
  let program: WebGLProgram | null = null
  let ready = false
  let inView = true
  /** Slow frames in a row; at SLOW_FRAMES the loop stops. */
  let slow = 0
  let loc: Record<string, WebGLUniformLocation | null> = {}
  /** Seconds of animation drawn so far; 0 is also the still frame. */
  let time = 0
  /** Timestamp of the last frame drawn, 0 when the loop has just started. */
  let last = 0
  let frame = 0
  /** Pointer position and the glows' lagging copy of it, from the centre. */
  const pointer = { x: 0, y: 0 }
  const offset = { x: 0, y: 0 }

  // Compiles and links without asking for the result, which would wait on the driver.
  function build() {
    if (gl.isContextLost()) return
    const parallel = gl.getExtension('KHR_parallel_shader_compile')
    program = gl.createProgram()
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertexSource],
      [gl.FRAGMENT_SHADER, fragmentSource],
    ] as const) {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      gl.attachShader(program, shader)
      gl.deleteShader(shader)
    }
    gl.linkProgram(program)
    const built = program
    requestAnimationFrame(function check() {
      // A lost context, or a restore that built a newer program, ends this check.
      if (gl.isContextLost() || program !== built) return
      if (
        parallel &&
        !gl.getProgramParameter(built, parallel.COMPLETION_STATUS_KHR)
      )
        requestAnimationFrame(check)
      else if (gl.getProgramParameter(built, gl.LINK_STATUS)) setup(built)
      else canvas.remove()
    })
  }

  function setup(linked: WebGLProgram) {
    gl.useProgram(linked)
    // Corners at (-1, -1), (3, -1) and (-1, 3) put the clip square inside the triangle.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    loc = Object.fromEntries(
      ['u_resolution', 'u_time', 'u_offset', ...Object.keys(COLORS)].map(
        (name) => [name, gl.getUniformLocation(linked, name)],
      ),
    )
    readColors()
    resize()
    draw()
    ready = true
    canvas.classList.add('ready')
    update()
  }

  /** Runs the loop only while motion is allowed, cheap and in view. */
  function update() {
    const play =
      ready &&
      !software &&
      !reduce.matches &&
      slow < SLOW_FRAMES &&
      inView &&
      document.visibilityState === 'visible'
    if (play && !frame) {
      // Late frames before a pause don't count towards a stop after it.
      last = slow = 0
      frame = requestAnimationFrame(tick)
    } else if (!play && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick)
    if (!last) {
      last = now
      return
    }
    const elapsed = now - last
    if (elapsed < FRAME_TIME) return
    last = now
    slow = elapsed > SLOW_FRAME ? slow + 1 : 0
    // Too slow to animate smoothly: keep the frame on screen and stop.
    if (slow === SLOW_FRAMES) return update()
    const dt = Math.min(elapsed / 1000, MAX_STEP)
    time += dt
    const follow = 1 - Math.exp(-dt / POINTER_LAG)
    offset.x += (pointer.x - offset.x) * follow
    offset.y += (pointer.y - offset.y) * follow
    draw()
  }

  // light-dark() resolves only in a computed value, so each token passes
  // through the canvas's own colour.
  function readColors() {
    for (const [name, token] of Object.entries(COLORS)) {
      canvas.style.color = `var(${token})`
      const [r, g, b] = getComputedStyle(canvas)
        .color.match(/[\d.]+/g)!
        .map(Number)
      gl.uniform3f(loc[name], r / 255, g / 255, b / 255)
    }
    canvas.style.removeProperty('color')
  }

  /** Fits the backbuffer to the canvas; returns whether its size changed. */
  function resize(): boolean {
    const { clientWidth: w, clientHeight: h } = canvas
    const scale = Math.min(
      1,
      Math.max(MIN_SCALE, Math.sqrt(MAX_PIXELS / (w * h))),
    )
    const width = Math.round(w * scale)
    const height = Math.round(h * scale)
    if (width === canvas.width && height === canvas.height) return false
    canvas.width = width
    canvas.height = height
    return true
  }

  function draw() {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(loc.u_resolution, canvas.width, canvas.height)
    gl.uniform1f(loc.u_time, time)
    gl.uniform2f(
      loc.u_offset,
      offset.x * POINTER_REACH,
      offset.y * POINTER_REACH,
    )
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  new ResizeObserver(() => {
    if (ready && resize()) draw()
  }).observe(canvas)

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!ready) return
    readColors()
    draw()
  })

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    update()
  }).observe(canvas)
  document.addEventListener('visibilitychange', update)

  // Reduced motion shows the first frame, still, without the pointer.
  reduce.addEventListener('change', () => {
    if (!ready) return
    if (reduce.matches) {
      time = offset.x = offset.y = 0
      draw()
    }
    update()
  })

  addEventListener(
    'pointermove',
    (event) => {
      if (!finePointer.matches) return
      pointer.x = event.clientX / innerWidth - 0.5
      pointer.y = 0.5 - event.clientY / innerHeight
    },
    { passive: true },
  )

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    ready = false
    program = null
    update()
    canvas.classList.remove('ready')
  })
  canvas.addEventListener('webglcontextrestored', () => idle(build))

  idle(build)
}
