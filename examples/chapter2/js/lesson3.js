import VSHADER_SOURCE from '../vshader/lesson3.vs'
import FSHADER_SOURCE from '../fshader/lesson3.fs'

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
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	// 获取uniform变量地址
	var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

	// 数据传递
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
	gl.vertexAttrib1f(a_PointSize, 10.0)
	gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0)

	// 指定清空canvas颜色
	gl.clearColor(0.0, 0.0, 0.0, 1.0)

	// 清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT)

  // 绘制
  gl.drawArrays(gl.POINTS, 0, 1)

}


main()