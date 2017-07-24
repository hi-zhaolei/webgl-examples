precision mediump float;
uniform vec3 u_LightColor; // 自然光颜色
uniform vec3 u_LightPosition; // 光源位置
uniform vec3 u_AmbientLight; // 环境光颜色
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
void main() {

  // 对法向量进行归一化
  vec3 normal = normalize(v_Normal)
  // 计算光线方向，归一化
  vec3 lightDirection = normalize( u_LightPosition - v_Position );
  // 法向量和光方向夹角
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // 漫反射光颜色
  vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
  // 环境反射光颜色
  vec3 ambient = u_AmbientLight * vec3(v_Color);

  gl_FragColor = vec4( diffuse + ambient, v_Color.a);
  
}
