// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson6.vs'
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
  viewMatrix.setLookAt(0, 0, 15, 0, 0, -100, 0, 1, 0)
  // var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

	// 透视投影矩阵
  var projMatrix = new Matrix4()
  projMatrix.setPerspective(30, canvas.height / canvas.width, 10, 100);
  // var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)
  
  // 模型矩阵
  var modelMatrix = new Matrix4()
  // modelMatrix.setTranslate(0.75,0,0);
  // var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // 合并矩阵
  var mvpMatrix = new Matrix4()
  mvpMatrix.set(projMatrix).multiply(viewMatrix)
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
	
  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
	// 背景色
	gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	//
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
  
	var rotateX = 0;
	var rotateY = 0;
	var iBtn = false;
	canvas.addEventListener('mousedown', function(e){
		iBtn = true
	});
	canvas.addEventListener('mouseup', function(e){
		iBtn = false
	});
	canvas.addEventListener('mousemove', function(e){
		if ( !iBtn ) return;

		rotateX += e.movementY;
		rotateY += e.movementX;
		modelMatrix.setRotate(rotateX, 1, 0, 0).rotate(rotateY, 0, 1, 0);
		mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
		gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

		gl.clear(gl.COLOR_BUFFER_BIT)

    // gl.drawArrays(gl.TRIANGLES, 0, n);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
	}, false)
}

function initVertexBuffers (gl) {
	var verticesColors = new Float32Array([
    1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
    -1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    -1.0, -1.0, 1.0, 0.0, 1.0, 0.0,
    1.0, -1.0, 1.0, 0.0, 0.0, 1.0,
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
    -1.0, 1.0, -1.0, 1.0, 1.0, 0.0,
    1.0, -1.0, -1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
  ]);
  var indeices = new Uint8Array([
    0, 1, 2, 0, 2, 3, // 前
    0, 3, 4, 3, 4, 6, // 右
    0, 1, 5, 0, 5, 4, // 上
    1, 2, 5, 2, 7, 5, // 左
    7, 2, 3, 7, 3, 6, // 下
    5, 7, 4, 4, 7, 6, // 后
  ])
	var n = verticesColors.length / 6
	console.log('共会址点' + n + '个')
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
	// 

	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	// 将缓冲区对象分配给a_Color
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	// 链接a_Colro与缓冲区
	gl.enableVertexAttribArray(a_Color)
	// 
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeices, gl.STATIC_DRAW);

	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return indeices.length;
}

main()