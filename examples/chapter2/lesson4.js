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

	const oL = canvas.offsetLeft;
	const oT = canvas.offsetTop;
	const oW = canvas.offsetWidth / 2;
	const oH = canvas.offsetHeight / 2;
	let poiCache = [];

	canvas.onmousemove = function(ev){
		ev = window.event || ev;
		let iX = ( ev.clientX - oL - oW ) / oW;
		let iY = -( ev.clientY - oT - oH ) / oH;
		console.log(iX, iY)
		poiCache.push({
			x: iX,
			y: iY,
			r: Math.random().toFixed(1),
			g: Math.random().toFixed(1),
			b: Math.random().toFixed(1)
		})
		// 清空canvas		
		gl.clear(gl.COLOR_BUFFER_BIT)
		// 数据传递
		poiCache.forEach(function(poi, index){
			gl.vertexAttrib3f(a_Position, poi.x, poi.y, 0.0)
			gl.uniform4f(u_FragColor, poi.r, poi.g, poi.b, 1.0)		
			// 绘制
			gl.drawArrays(gl.POINTS, 0, 1)
		})
	}

}

function clickFn () {

}

const VSHADER_SOURCE =
	'precision mediump float;\n' +
	'attribute vec4 a_Position;\n' +
	'attribute float a_PointSize;\n' +
  'void main() {\n' +
  ' gl_Position = a_Position;\n' +
  ' gl_PointSize = a_PointSize;\n' +
  '}\n';

const FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  ' gl_FragColor = u_FragColor;\n' +
  '}\n';




main()