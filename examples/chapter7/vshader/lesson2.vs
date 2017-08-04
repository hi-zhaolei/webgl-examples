attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewModelMatrix;
varying vec4 v_Color;

void main() {

  gl_Position = u_ViewModelMatrix * a_Position;

  gl_PointSize = 10.0;
  
  v_Color = a_Color;

}