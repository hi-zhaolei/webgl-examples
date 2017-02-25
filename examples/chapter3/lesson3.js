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

	// 获取attribute变量地址
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	// 数据传递
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
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
		0.5,
		-0.5,
		-0.5,
		0.5,
		0.5,
		0.5,
		-0.5
	])
	let n = ( 0.5 + vertices.length/2 ) | 0; // points number
	let vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create buffer object!')
		return ;
	}

	// 将缓冲区对象绑定到目标 高速webgl缓冲区用途
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	// 向缓冲区对象中写入数据 数据不能直接写入缓存区，只能通过ARRAY_BUFFER
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
	// 获取变量地址
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
	// 将缓冲区对象分配给变量	
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
	// 链接a_Position变量与分配给他的缓存区对象
	gl.enableVertexAttribArray(a_Position)
	return n;
}


const VSHADER_SOURCE =
	'precision mediump float;\n' +
	'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position;\n' +
  ' gl_PointSize = 10.0;\n' +
  '}\n';

const FSHADER_SOURCE =
	'precision mediump float;\n' +
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';




main()
