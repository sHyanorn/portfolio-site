#version 300 es

// One triangle larger than the viewport covers it with no seam along a
// diagonal, which two triangles of a quad would share (D015).
layout(location = 0) in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
