// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson2.vs'
import FSHADER_SOURCE from '../fshader/lesson2.fs'


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

	// 初始化顶点缓存
	var n = initVertexBuffers(gl)
	
	// 获取uniform变量
	var u_ViewModelMatrix = gl.getUniformLocation(gl.program, 'u_ViewModelMatrix');

	// 设置视点，视线和上方向, 获取视图矩阵
	var viewMatrix = new Matrix4();
	viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)

	// 获取模型矩阵
	var modelMatrix = new Matrix4()
  modelMatrix.setRotate(-10, 0, 0, 1);
  
  var viewModelMatrix = viewMatrix.multiply(modelMatrix)
	gl.uniformMatrix4fv(u_ViewModelMatrix, false, viewModelMatrix.elements)

	// 背景色
	gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	//
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers (gl) {
	var verticesColors = new Float32Array([
		// 绿色
		0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
		-0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
		0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

		// 黄色
		0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
		-0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
		0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

		// 蓝色
		0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
		-0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
		0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
	]);
	var n = verticesColors.length / 6
	var vertexColorBuffer = gl.createBuffer();
	if(!vertexColorBuffer){
		console.log('Failed to create buffer object!');
		return ;
	}
	var FSIZE = verticesColors.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)
	// 获取attribute变量地址
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	// 将缓冲区对象分配给变量
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
	// 链接a_Position变量与分配给他的缓存区对象
	gl.enableVertexAttribArray(a_Position);

	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	// 将缓冲区对象分配给a_Color
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	// 链接a_Colro与缓冲区
	gl.enableVertexAttribArray(a_Color)

	return n;
}

main()