attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; // 法向量
uniform mat4 u_MvpMatrix; // 顶点变换
uniform mat4 u_ModelMatrix; // 模型矩阵
uniform mat4 u_NormalMatrix; // 逆转矩阵
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
void main () {

  gl_Position = u_MvpMatrix * a_Position;

  // 顶点世界坐标
  v_Position = vec3( u_ModelMatrix * a_Position );
  // 表面法向量
  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
  // 
  v_Color = a_Color;
}