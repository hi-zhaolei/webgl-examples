import VSHADER_SOURCE from '../vshader/lesson5.vs'
import FSHADER_SOURCE from '../fshader/lesson1.fs'


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
