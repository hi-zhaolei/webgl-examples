attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; // 法向量
uniform mat4 u_MvpMatrix; // 顶点变换
uniform mat4 u_NormalMatrix; // 逆转矩阵
uniform vec3 u_LightColor; // 自然光颜色
uniform vec3 u_LightDirection; // 自然光方向
uniform vec3 u_AmbientLight; // 环境光颜色
varying vec4 v_Color;

void main () {

  gl_Position = u_MvpMatrix * a_Position;
  // 归一化法向量
  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
  // 法向量和光方向夹角
  float nDotL = max(dot(u_LightDirection, normal), 0.0);
  // 漫反射光颜色
  vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
  // 环境反射光颜色
  vec3 ambient = u_AmbientLight * vec3(a_Color);

  v_Color = vec4( diffuse + ambient, a_Color.a);

}
