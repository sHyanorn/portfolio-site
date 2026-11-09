// The home page background (D015): WebGL2 shades one full-screen triangle
// with a slowly flowing noise field. The CSS gradient under the canvas shows
// until the first frame, and stays when WebGL2 is missing, the shaders fail
// to link or the context is lost; none of these throws or logs an error.
import vertexSource from './shaders/background.vert.glsl?raw'
import fragmentSource from './shaders/background.frag.glsl?raw'

/** Backbuffer budget in pixels; the scale also stays at or under one pixel per CSS pixel. */
const MAX_PIXELS = 200_000
/** Smallest backbuffer scale: upscaled further, the dither smears and banding shows. */
const MIN_SCALE = 0.5

/** Shader colours and the tokens in tokens.css they come from. */
const COLORS = {
  u_base: '--color-backdrop',
  u_tint: '--color-backdrop-tint',
  u_strong: '--color-backdrop-strong',
}

/** Runs a startup step while the main thread is idle, so no step lengthens a task. */
function idle(step: () => void): void {
  if (typeof requestIdleCallback === 'function')
    requestIdleCallback(step, { timeout: 1000 })
  else setTimeout(step, 1)
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
  let program: WebGLProgram | null = null
  let ready = false
  let loc: Record<string, WebGLUniformLocation | null> = {}
  /** Seconds of animation drawn so far. */
  let time = 0
  /** Timestamp of the last frame drawn. */
  let last = 0
  let frame = 0

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
    requestAnimationFrame(function check(now) {
      if (gl.isContextLost() || !program) return
      if (
        parallel &&
        !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)
      )
        requestAnimationFrame(check)
      else if (gl.getProgramParameter(program, gl.LINK_STATUS))
        setup(program, now)
      else canvas.remove()
    })
  }

  function setup(linked: WebGLProgram, now: number) {
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
      ['u_resolution', 'u_time', ...Object.keys(COLORS)].map((name) => [
        name,
        gl.getUniformLocation(linked, name),
      ]),
    )
    readColors()
    resize()
    draw()
    ready = true
    canvas.classList.add('ready')
    last = now
    frame = requestAnimationFrame(tick)
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick)
    time += (now - last) / 1000
    last = now
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

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    cancelAnimationFrame(frame)
    ready = false
    program = null
    canvas.classList.remove('ready')
  })
  canvas.addEventListener('webglcontextrestored', () => idle(build))

  idle(build)
}
