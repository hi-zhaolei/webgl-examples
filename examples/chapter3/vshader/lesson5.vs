// 思路：
// 假设相对于Z轴逆时针旋转，右手法则，右手握拳，大拇指伸直指向旋转轴的正向，其余4指握的方向就是旋转方向
// ∂为初始坐标p(x,y,z)相对于x轴的角度，ß为坐标p(x`,y`,z`)的旋转角度, r为坐标系原点到p的距离
// 则有：x = r*cos∂, y = r*sinß, x` = r * cos(∂+ß), y` = r * sin(∂+ß)
// 又因为sin(∂+ß) = sin∂*cosß - cos∂*sinß, cos(∂+ß) = cos∂ * cosß - sin∂ * sinß
// 则有 x` = x*consß - y*sinß, y` =  x*sinß + y*cosß 

precision mediump float;
attribute vec4 a_Position;
uniform float u_CosB, u_SinB; // 新增
// uniform vec3 u_CosBSinB; // 或者创建一个数组，存储cosB sinB

void main() {

	gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
	gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
  // 	gl_Position.x = a_Position.x * u_CosBSinB.x - a_Position.y * u_CosBSinB.y ;
  // 	gl_Position.y = a_Position.x * u_CosBSinB.y + a_Position.y * u_CosBSinB.x;
  gl_Position.z = a_Position.z;
  gl_Position.w = 1.0;
  
}