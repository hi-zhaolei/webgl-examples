3// 思路
// 将顶点坐标传入着色器中，需要遵循以下几步
// 1. 创建缓存区对象
// 2. 将缓存区对象绑定到target上
// 3.将顶点坐标数据写入缓存区
// 4.将缓存区对象分配给对应的attribute变量
// 5.开启attribute变量
// 顶点着色器
import VSHADER_SOURCE from '../vshader/lesson3.vs'
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
	const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(3, 3, 10, -3, -3, -10, 0, 1, 0)
	// 透视投影矩阵
  const projMatrix = new Matrix4()
  projMatrix.setPerspective(30, canvas.height / canvas.width, 5, 100);
  
  // 模型矩阵
  const modelMatrix = new Matrix4()
  modelMatrix.setTranslate(0,0,0);
  const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  // 矩阵合并
  const mvpMatrix = new Matrix4()
  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  mvpMatrix.set(projMatrix).multiply(viewMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  // 逆转矩阵
  const normalMatrix = new Matrix4()
  const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)
  
  // 设置光线颜色
  const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

  // 设置点光源位置
  const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  const lightDirection = new Vector3([0.0, 3.0, 4.0]);
  gl.uniform3fv(u_LightPosition, lightDirection.elements)

  // 设置环境光颜色
  const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)
  
  // 开启隐藏面消除
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
	// 背景色
	gl.clearColor( 0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	//
  gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
	let rotateX = 0;
	let rotateY = 0;
	let iBtn = false;
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
    
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  	gl.drawArrays(gl.TRIANGLES, 0, n);
	}, false)
}

function initVertexBuffers (gl) {
	const trianglesArray = [
    // 右侧
		// 第一个面，前侧
		-1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,

		1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		-1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,

		// 第二个面，右侧
		1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
		1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
		1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,

		1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
		1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
		1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,

		// 第三个面，底侧
		-1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
		1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
		-1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,

		-1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
		1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
		1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,

		// 第四个面 左侧
		-1.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
		-1.0, -1.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
		-1.0, 1.0, -1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,

		-1.0, 1.0, -1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
		-1.0, -1.0, 1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,
		-1.0, -1.0, -1.0, 1.0, 1.0, 0.0, -1.0, 0.0, 0.0,

		// 第五个面 后侧
		-1.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
		-1.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
		1.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,

		1.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
		-1.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
		1.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,

		// 第六个面 顶侧

		-1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
		1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
		-1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,

		-1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
		1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
		1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
	];
	const verticesColors = new Float32Array(trianglesArray);
	const n = verticesColors.length / 9
	console.log('共会址点' + n + '个')
	const vertexColorBuffer = gl.createBuffer();
	if(!vertexColorBuffer){
		console.log('Failed to create buffer object!');
		return ;
	}
	const FSIZE = verticesColors.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)
	// 获取attribute变量地址
	const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	// 将缓冲区对象分配给变量
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0)
	// 链接a_Position变量与分配给他的缓存区对象
	gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttrib4f(a_Color, 1.0, 1.0, 1.0, 1.0)
	// 将缓冲区对象分配给a_Color
	// gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
	// 链接a_Colro与缓冲区
  // gl.enableVertexAttribArray(a_Color)
  
  const a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6)
  gl.enableVertexAttribArray(a_Normal)

	return n;
}

main()