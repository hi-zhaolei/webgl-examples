import VSHADER_SOURCE from '../vshader/lesson1.vs'
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
	// 一系列的点，绘制在v0 v1 v2.....处
	console.log(gl)
	gl.drawArrays(gl.POINTS, 0, n)
	// 一系列单独线段， 绘制在(v0, v1), (v2,v3)....
	// 如果点是奇数，最后一个点会被忽略
	// gl.drawArrays(gl.LINES, 0, n)
	// 一系列链接的线段，绘制在(v0, v1), (v1,v2)....
	// 最后一个点是线段终点
	//gl.drawArrays(gl.LINE_STRIP, 0, n)
	// 一系列链接的线段，绘制在(v0, v1), (v1,v2)....(vn,v0)
	// 与上面不同，会增加最后一个点到第一个点的线段
	//gl.drawArrays(gl.LINE_LOOP, 0, n)
	// 一系列单独的三角形，绘制在(v0,v1,v2), (v3,v4,v5)....
	// 如果点的个数不是3的整数倍，剩下的点数将被忽略
	//gl.drawArrays(gl.TRIANGLES, 0, n)
	// 一系列条带状的三角形，前三个点构成了第一个三角形，从第二个点开始的三个点构成第2个三角形, (v0, v1, v2), (v2,v1,v3)
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
	// 一系列三角形做成的类似于扇形的图形,前三个点构成一个三角形，接下来的一个点和前一个三角形的最后一条边组成接下来的一个三角形
	// 这些三角形被绘制在(v0,v1,v2),(v0,v2,v3),(v0,v3,v4).....处
	//gl.drawArrays(gl.TRIANGLE_FAN, 0, n)

}

function initVertexBuffers (gl) {
	let vertices = new Float32Array([
		0.0,
		0.5,
		-0.5,
		-0.5,
		0.5,
		-0.5
	])
	let n = 3; // points number
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

main()
