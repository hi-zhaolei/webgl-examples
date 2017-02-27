// 思路：
// 图形缩放
// 对目标三角形进行s缩放，三角形一个点为p(x,y,z)，变换后为p`(x`,y`,z`)，假设缩放因子为S
// x` = Sx * x
// y` = Sy * y
// z` = Sz * z
// 转换成矩阵为
// |x`|   |Sx 0  0   0|   |x|
// |y`| = |0  Sy 0   0| * |y|
// |z`|   |0  0  Sz  0|   |z|
// |1 |   |0  0  0   0|   |1|
//
// 顶点着色器
const VSHADER_SOURCE =
	'precision mediump float;\n' +
	'attribute vec4 a_Position;\n' +
	'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
	' gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';
// 片元着色器
const FSHADER_SOURCE =
	'precision mediump float;\n' +
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main () {

	// 获取cavas元素
	var canvas = document.getElementById('myCanvas')
	if(!canvas){
		console.log('Failed to retrieve the <canvas> element')
		return;
	}
	
	// 获取绘制二维图形绘图上下文
	//var ctx = canvas.getContext('2d')
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
	
	const ANGLE = 60;
	let rad = Math.PI * ANGLE / 180; // 转弧度
	let sinB = Math.sin(rad);
	let cosB = Math.cos(rad);
	// 获取attribute变量地址
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')

	// 数据传递
	// 因为js中没有专门表示矩阵的类型，所以需要用类型化数组(eg:Float32Array)表示二维的矩阵
	// 可以按照两种方式在数组中存储矩阵元素，按行主序和按列主序
	// WebGL和OpenGL一样，都是按列主序存储在数组中
	let Sx = 1.0,
			Sy = 1.5,
			Sz = 1.0 
	// attention: 如果缩放因子为0.0，图形就会缩小到不可见，正常值为1.0
	let xformMatrix = new Float32Array([
		Sx, 0.0, 0.0, 0.0,
		0.0, Sy, 0.0, 0.0,
		0.0, 0.0, Sz, 0.0,
		0.0, 0.0, 0.0, 1.0
	])
	gl.vertexAttrib4f(a_Position, 0.0, 0.0, 0.0, 1.0)
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

	let n = initVertexBuffers(gl)
	if( n < 0 ){
		console.log('Failed to set positions of vertices')
		return ;
	}

	// 指定清空canvas颜色
	gl.clearColor(0.0, 0.0, 0.0, 1.0)

	// 清空canvas		
	gl.clear(gl.COLOR_BUFFER_BIT)
	// 绘制
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
	// gl.drawArrays(gl.TRIANGLE_FAN, 0, n)

}

function initVertexBuffers (gl) {
	let vertices = new Float32Array([
		-0.5,
		-0.5,
		0,
		0.5,
		0.5,
		-0.5,
	])
	let n = ( 0.5 + vertices.length/2 ) | 0; // points number
	let vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create buffer object!')
		return ;
	}

	// 将缓冲区对象绑定到目标 描述webgl缓冲区用途
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	// 向缓冲区对象中写入数据 数据不能直接写入缓存区，只能通过ARRAY_BUFFER
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
	// 获取变量地址
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
	let u_Translate = gl.getUniformLocation(gl.program, 'u_Translate')
	gl.uniform4f(u_Translate, 0.5, 0.5, 0.0, 0.0)
	// 将缓冲区对象分配给变量	
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
	// 链接a_Position变量与分配给他的缓存区对象
	gl.enableVertexAttribArray(a_Position)
	return n;
}





main()
