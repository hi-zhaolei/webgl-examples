// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson7.vs'
import FSHADER_SOURCE from '../fshader/lesson1.fs'

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

	// 视图矩阵
	var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 5)
  // var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

	// 透视投影矩阵
  var projMatrix = new Matrix4()
  projMatrix.setPerspective(30, canvas.height / canvas.width, 1, 100);
  // var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)
  
  // 模型矩阵
  var modelMatrix = new Matrix4()
  modelMatrix.setTranslate(0.75,0,0);
  // var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // 合并矩阵
  var mvpMatrix = new Matrix4()
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
	// 背景色
	gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	//
  gl.drawArrays(gl.TRIANGLES, 0, n);

  // modelMatrix.setTranslate(-0.75,0,0)
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  //
  modelMatrix.setTranslate(-0.75,0,0);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)  
  // 
  gl.drawArrays(gl.TRIANGLES, 0, n);
  
}

function initVertexBuffers (gl) {
	var verticesColors = new Float32Array([
    // 右侧
		// 蓝色
		0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
		0.4, -1.0, 0.0, 0.4, 0.4, 1.0,
    -0.4, -1.0, 0.0, 0.4, 0.4, 1.0,

		// 黄色
		0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
		0.4, -1.0, -2.0, 1.0, 1.0, 0.4,
    -0.4, -1.0, -2.0, 1.0, 1.0, 0.4,
    
    // 绿色
    0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
    0.4, -1.0, -4.0, 0.4, 1.0, 0.4,
    -0.4, -1.0, -4.0, 0.4, 1.0, 0.4,
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

function draw () {
  // 视图矩阵
  var near = document.getElementsByName('near')[0].value / 100;
  var far = document.getElementsByName('far')[0].value / 100;
  // viewMatrix.setLookAt( eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
  proMatrix.setOrtho(-1, 1, -1, 1, near, far);
  // 模型矩阵
  var rotateX = document.getElementsByName('rotateX')[0].value;
  var rotateY = document.getElementsByName('rotateY')[0].value;
  console.log(rotateX,rotateY)
  modelMatrix.setRotate(+rotateX, 1, 0, 0).rotate(+rotateY, 0, 1, 0);
  // 
  var viewModelMatrix = proMatrix.multiply(modelMatrix)
	gl.uniformMatrix4fv(u_ViewModelMatrix, false, viewModelMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

main()