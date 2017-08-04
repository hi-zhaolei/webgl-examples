// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson1.vs'
import FSHADER_SOURCE from '../fshader/lesson1.fs'

function main () {

	// 获取cavas元素
	const canvas = document.getElementById('myCanvas')
	if(!canvas){
		console.log('Failed to retrieve the <canvas> element')
		return;
	}

	// 获取WebGL绘图上下文
	const gl = getWebGLContext(canvas)

	if(!gl){
		console.log('Failed to get the rendering context for WebGL')
		return;
	}

  if( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE ) ){
    console.log('Failed to initialize shaders')
    return;
	}

	// 初始化顶点缓存
	const n = initVertexBuffers(gl)

  // 视图矩阵
	var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(20, 10, 30, 0, 0, 0, 0, 1, 0)

	// 透视投影矩阵
  var projMatrix = new Matrix4()
  projMatrix.setPerspective(50, canvas.height / canvas.width, 10, 100);

  // 设置光线颜色
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

  // 设置光线方向
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var lightDirection = new Vector3([5.0, 4.0, 3.0]);
  lightDirection.normalize()
  gl.uniform3fv(u_LightDirection, lightDirection.elements)

  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)

  // 合并矩阵
  var viewProjMatrix = new Matrix4()
  viewProjMatrix.set(projMatrix).multiply(viewMatrix)
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
	// 背景色
	// gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  document.onkeydown = function (ev) {
    keydown(ev, gl, n, viewMatrix, u_MvpMatrix, u_NormalMatrix)
  }
  //
  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
}

function initVertexBuffers (gl) {
  let vertexArray = [
    1.5, 5.0, 1.5, 1.0, 1.0, 1.0,
    -1.5, 5.0, 1.5, -1.0, 1.0, 1.0,
    -1.5, -5.0, 1.5, -1.0, -1.0, 1.0,
    1.5, -5.0, 1.5, 1.0, -1.0, 1.0,
    1.5, 5.0, -1.5, 1.0, 1.0, -1.0,
    -1.5, 5.0, -1.5, -1.0, 1.0, -1.0,
    -1.5, -5.0, -1.5, -1.0, -1.0, -1.0,
    1.5, -5.0, -1.5, 1.0, -1.0, -1.0,
  ];
	const verticesArray = new Float32Array(vertexArray);
	const vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create buffer object!');
		return ;
	}
	const FSIZE = verticesArray.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW)
	// 获取attribute变量地址
	const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	// 将缓冲区对象分配给变量
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 0)
	// 链接a_Position变量与分配给他的缓存区对象
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0);

  const a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Normal);


  const indices = [
    0, 1, 2, 0, 2, 3, // 前
    0, 3, 4, 4, 3, 7, // 右
    0, 1, 5, 0, 5, 4, // 上
    1, 2, 5, 2, 6, 5, // 左
    6, 2, 3, 6, 3, 7, // 下
    5, 7, 4, 5, 6, 7, // 后
  ];
  const indexArray = new Uint8Array(indices);
  const indexBuffer = gl.createBuffer()
  if(!indexBuffer){
		console.log('Failed to create buffer object!');
		return ;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW)

	return indices.length;
}

var ANGLE_STEP = 3.0; // 每次案件转动的角度
var g_arm1Angle = 90.0; // arm1当前角度
var g_joint1Angle = 0.0; // arm1当前角度
function keydown (ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  switch (ev.keyCode) {
    case 38:
      console.log('up')
      if ( g_joint1Angle > 135 ) g_joint1Angle += ANGLE_STEP;
      break;
    case 40:
      console.log('down')
      if ( g_joint1Angle > 135 ) g_joint1Angle -= ANGLE_STEP;
      break;
    case 37:
      console.log('left')
      g_arm1Angle = ( g_arm1Angle + ANGLE_STEP ) % 360;
      break;
    case 39:
      console.log('right')
      g_arm1Angle = ( g_arm1Angle - ANGLE_STEP ) % 360;
      break;
    default:
      return;
  }
  console.log(g_arm1Angle)
  // 背景色

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
}

var g_modelMatrix = new Matrix4();

function draw (gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  //
  gl.clearColor( 0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // arm1
  var arm1Length = 10.0;
  g_modelMatrix.setTranslate(0.0, -6.0, 0.0);
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
  drawArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  // arm2
  g_modelMatrix.setTranslate(0.0, 5.0, 0.0);
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
  // g_modelMatrix.scale(1.3, 1.0, 1.3)
  drawArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function drawArm (gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  //
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  //
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
}

main()
