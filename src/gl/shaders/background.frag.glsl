#version 300 es
precision highp float;

// The home page background (D015): soft colour fields. Three wide glows sit
// just above the top edge, so only their lower parts show, and drift on slow
// paths whose periods share no common factor. Two mix the page background
// with the tint; the third, smaller, brings in the strong colour near the top
// right. The colour fades into the page over the lower half.

uniform vec2 u_resolution;
uniform float u_time;
// Where the pointer has moved the glows, in fractions of the canvas.
uniform vec2 u_offset;
uniform vec3 u_base;
uniform vec3 u_tint;
uniform vec3 u_strong;

out vec4 color;

const float TAU = 6.28318531;

// 1 at the glow's centre, falling off as a Gaussian of the distance in radii.
// The centre swings by `reach` either side of `home`, once per `period`
// seconds on each axis. Positions are fractions of the canvas from its bottom
// left; radii are in units of half its width plus height, so a glow keeps its
// shape from a phone to a wide screen, and `size` is the canvas in those
// units. The CSS fallback in Home.astro draws each glow at its home.
float glow(
  vec2 uv,
  vec2 size,
  vec2 home,
  vec2 reach,
  vec2 period,
  vec2 radius
) {
  vec2 centre = home + reach * sin(TAU * u_time / period);
  vec2 d = (uv - centre) * size / radius;
  return exp(-dot(d, d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  // The glows follow the pointer; the fade into the page stays in place.
  vec2 at = uv - u_offset;
  vec2 size = u_resolution / (0.5 * (u_resolution.x + u_resolution.y));

  float left = glow(
    at,
    size,
    vec2(0.12, 1.12),
    vec2(0.12, 0.05),
    vec2(43.0, 31.0),
    vec2(0.42, 0.3)
  );
  float right = glow(
    at,
    size,
    vec2(0.92, 1.06),
    vec2(-0.1, 0.05),
    vec2(37.0, 47.0),
    vec2(0.4, 0.3)
  );
  float core = glow(
    at,
    size,
    vec2(0.8, 1.1),
    vec2(-0.16, -0.04),
    vec2(53.0, 41.0),
    vec2(0.34, 0.28)
  );

  // Glows of one colour add like light: together they stay under full strength.
  vec3 c = mix(u_base, u_tint, 1.0 - (1.0 - left) * (1.0 - right));
  c = mix(c, u_strong, core);
  c = mix(u_base, c, smoothstep(0.0, 0.5, uv.y));

  // Interleaved gradient noise (Jimenez 2014) dithers by half an 8-bit step,
  // so the slow gradients show no bands.
  float dither = fract(
    52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))
  );
  color = vec4(c + (dither - 0.5) / 255.0, 1.0);
}
