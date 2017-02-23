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

	// 指定清空canvas色
	gl.clearColor(0.0, 0.0, 0.0, 1.0)

	// 清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT)
}
main()
