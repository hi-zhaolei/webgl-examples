// 思路：
// 学习Matrix库使用
// Matrix是一个矩阵变换类
// 想要使用它需要先进行实例化
// let xformMatrix = new Matrix4()
// 实例有以下方法
// Matrix4,setIndentity()  将Matrix4实例初始化为单位阵
// Matrix4.setTranslate(x,y,z)  将Matrix4实例设置为平移变换矩阵，在x轴上平移的距离为x，在y轴上平移的距离为y，z轴上平移距离z
// Matrix4.setRotate(angle,x,y,z)  将Matrix4实例设置为旋转变换矩阵，旋转角度为angle，旋转轴为(x,y,z)
// Matrix4.setScale(x,y,z)  将Matrix4实例设置为缩放变换矩阵，参数为三个轴上的缩放因子
// Matrix4.translate(x,y,z)   将Matrix4实例乘以一个平移变换矩阵
// Matrix4.rotate(angle,x,y,z)  将Matrix4实例乘以一个旋转变换矩阵
// Matrix4.scale(x,y,z)   将Matrix4实例乘以一个缩放变换矩阵
// Matrix4.set(m)  将Matrix4实例设置为m，m必须是一个Matrix4的实例
// Matrix4.elements  类型化数组包含了Matrix4的实例矩阵元素
//
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

	const ANGLE = 60;
	let rad = Math.PI * ANGLE / 180; // 转弧度
	let sinB = Math.sin(rad);
	let cosB = Math.cos(rad);
	// 获取attribute变量地址
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')

	// 使用新的Matrix函数库进行数据传递
	// 为旋转矩阵创建Matrix4
	let xformMatrix = new Matrix4()
	// 设置为旋转矩阵
	// setRotate参数有4个，第一个为旋转角度，后三个为旋转周，x为1,0,0 y为0,1,0 z为0,0,1
	xformMatrix
		.setRotate(ANGLE, 0, 0, 1)
		.translate(0.5,0.5,0)
		.scale(1,1.5,1)
	gl.vertexAttrib4f(a_Position, 0.0, 0.0, 0.0, 1.0)
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements)

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
