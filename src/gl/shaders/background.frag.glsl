#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_base;
uniform vec3 u_tint;

out vec4 color;

void main() {
  float y = gl_FragCoord.y / u_resolution.y;
  color = vec4(mix(u_base, u_tint, y), 1.0);
}
