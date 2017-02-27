// 思路：
// 假设相对于Z轴逆时针旋转，右手法则，右手握拳，大拇指伸直指向旋转轴的正向，其余4指握的方向就是旋转方向
// ∂为初始坐标p(x,y,z)相对于x轴的角度，ß为坐标p(x`,y`,z`)的旋转角度, r为坐标系原点到p的距离
// 则有：x = r*cos∂, y = r*sinß, x` = r * cos(∂+ß), y` = r * sin(∂+ß)
// 又因为sin(∂+ß) = sin∂*cosß - cos∂*sinß, cos(∂+ß) = cos∂ * cosß - sin∂ * sinß
// 则有 x` = x*consß - y*sinß, y` =  x*sinß + y*cosß 
// 顶点着色器
const VSHADER_SOURCE =
	'precision mediump float;\n' +
	'attribute vec4 a_Position;\n' +
	'uniform float u_CosB, u_SinB;\n' + // 新增
	// 'uniform vec3 u_CosBSinB;\n' + // 或者创建一个数组，存储cosB sinB
  'void main() {\n' +
	'	gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
	'	gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
	// '	gl_Position.x = a_Position.x * u_CosBSinB.x - a_Position.y * u_CosBSinB.y ;\n' +
	// '	gl_Position.y = a_Position.x * u_CosBSinB.y + a_Position.y * u_CosBSinB.x;\n' +
  ' gl_Position.z = a_Position.z;\n' +
  ' gl_Position.w = 1.0;\n' +
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
	
	const ANGLE = 90;
	let rad = Math.PI * ANGLE / 180; // 转弧度
	let sinB = Math.sin(rad);
	let cosB = Math.cos(rad);
	// 获取attribute变量地址
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB')
	let u_CosB = gl.getUniformLocation(gl.program, 'u_CosB')
	// let u_CosBSinB = gl.getUniformLocation(gl, program, 'u_CosBSinB)

	// 数据传递
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
	gl.uniform1f(u_SinB, sinB)
	gl.uniform1f(u_CosB, cosB)
	// gl.uniform2f(u_CosBSinB, cosB, sinB)

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
