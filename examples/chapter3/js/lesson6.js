// 思路：
// 对于简单的变换，我们可以用数学表达式实现。但当情形变复杂以后，却会变得相当繁琐，比如当一个三角形旋转后平移
// 此时我们需要使用矩阵:
// |x`|   |a  b  c|   |x|
// |y`| = |d  e  f| * |y|
// |z`|   |g  h  i|   |z|
// 上面的矩阵有3航3列，也叫3*3矩阵。矩阵右侧式一个[x,y,z]矢量，矢量具有3个分量，所以被称为三维矢量。
// 当矩阵的列数和矢量行数相等时，可得
// x` = ax + by + cz
// y` = dx + ey + fz
// z` = gx + hy + iz
// 旋转：
// 根据lesson5的三角形旋转公式
// x` = xcosß - ysinß
// y` = xsinß + ycosß
// z` = z
// 得出:
// |x`|   |cosß  -sinß  0|   |x|
// |y`| = |sinß  	cosß  0| * |y|
// |z`|   |  0     0    1|   |z|
// 这个矩阵称为**旋转矩阵**, 因为矩阵的变换是为了旋转矢量坐标，所以也可以叫做**旋转矩阵**
// 平移：
// 根据lesson4的平移公式
// x` = x + Tx
// 这里有一个常量项Tx，这在上面3*3的矩阵里是没有的，所以需要一个4*4的矩阵来解决这个问题
// |x`|   |a  b  c  d|   |x|
// |y`| = |e  f  g  h| * |y|
// |z`|   |i  j  k  l|   |z|
// |1 |   |m  n  o  p|   |1|
// 得出
// x` = ax + by + cz + d
// y` = ex + fy + gz + h
// z` = ix + jy + kz + l
// 1  = mx + ny + oz + p
// 对比lesson4的公式
// x` = x + Tx
// y` = y + Ty
// z` = z + Tz
// 得出
// |x`|   |1  0  0  Tx|   |x|
// |y`| = |0  1  0  Ty| * |y|
// |z`|   |0  0  1  Tz|   |z|
// |1 |   |0  0  0  1 |   |1|
// 回到主题，现在我们要对一个三角形进行先旋转再平移，则我们需要将这两个矩阵组合起来
// 因为这个两个矩阵阶数不同，所以需要将3阶矩阵转换为一个4阶矩阵
// |x`|   |cosß  -sinß  0  0|   |x|
// |y`| = |sinß  	cosß  0  0| * |y|
// |z`|   |  0     0    1  0|   |z|
// |1 |   |  0     0    0  1|   |1|
// 所以，我们要对一个三角形进行旋转并平移的操作，将上面两个矩阵整合得出
// |x`|   |cosß  -sinß  0  Tx|   |x|
// |y`| = |sinß  	cosß  0  Ty| * |y|
// |z`|   |  0     0    1  Tz|   |z|
// |1 |   |  0     0    0  1 |   |1|
//
//
//
import VSHADER_SOURCE from '../vshader/lesson6.vs'
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
	let xformMatrix = new Float32Array([
		cosB, sinB, 0.0, 0.0,
		-sinB, cosB, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.5, 0.5, 0.0, 1.0
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
