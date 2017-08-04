// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson3.vs'
import FSHADER_SOURCE from '../fshader/lesson3.fs'

function main () {

	// 获取cavas元素
	var canvas = document.getElementById('myCanvas')
	if(!canvas){
		console.log('Failed to retrieve the <canvas> element')
		return;
	}

	// 获取WebGL绘图上下文
	var gl = getWebGLContext(canvas)

	if(!gl){
		console.log('Failed to get the rendering context for WebGL')
		return;
	}

  if( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE ) ){
    console.log('Failed to initialize shaders')
    return;
  }
  // 旋转速度
	var ANGLE_STEP = 45.0;
	var g_last = Date.now()

	window.upperAngleStep = function () {
		ANGLE_STEP += 5
		console.log('current angle step is '+ANGLE_STEP)
	}

	window.lowerAngleStep = function () {
		ANGLE_STEP -= 5
		console.log('current angle step is '+ANGLE_STEP)
	}

	// 初始化着色器
	var n = initVertexBuffers(gl)
	if( n < 0 ){
		console.log('Failed to set positions of vertices')
		return ;
	}
	// 背景色
	gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	//
	gl.drawArrays(gl.POINTS, 0, n);
	// gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffers (gl) {
	// 点的坐标
	const verticesSizesColors = new Float32Array([
		-0.5, -0.5, 10.0, 1.0, 0.0, 0.0,
		0, 0.5, 20.0, 0.0, 1.0, 0.0,
		0.5, -0.5, 30.0, 0.0, 0.0, 1.0,
	]);

	const n = ( 0.5 + verticesSizesColors.length/6 ) | 0; // points number
	const vertexSizeColorBuffer = gl.createBuffer();
	if(!vertexSizeColorBuffer){
		console.log('Failed to create buffer object!');
		return ;
	}
	// 将缓冲区对象绑定到目标 描述webgl缓冲区用途
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeColorBuffer)
	// 向缓冲区对象中写入数据 数据不能直接写入缓存区，只能通过ARRAY_BUFFER
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizesColors, gl.STATIC_DRAW)
  
  const FSIZE = verticesSizesColors.BYTES_PER_ELEMENT;
	// 获取变量地址
	const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
	// 将缓冲区对象分配给变量
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0)
	// 链接a_Position变量与分配给他的缓存区对象
	gl.enableVertexAttribArray(a_Position)
  //
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(a_PointSize)
  
  //
  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
	gl.enableVertexAttribArray(a_Color)

	return n;
}


main()
