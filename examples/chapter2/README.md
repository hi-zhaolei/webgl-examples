# Chapter 2

## 获取WebGL上下文

`getWebGLContext(element,[, debug])`

获取WebGL上下文，如果开启了debug属性，遇到错误时将在控制台显示错误消息

|   |         |      |
----|---------|------------ |
|参数 | element | 制定canvas元素 |
|    | debug | 默认为false, 如果设置为true，控制台将现实错误，会影响性能 |
|返回值 | non-null | WebGL上下文 |
|      | null | WebGL不可用 |

[demo](http://127.0.0.1:3000/chapter2/lesson1)

## 设置绘图区颜色

`gl.clearColor(red, green, blue, alpha)`

制定绘图区域背景色

||||
|---|-----|----------------|
|参数 | red | 指定红色值（从0.0到1.0）|
|    | green | 指定绿色值（从0.0到1.0）|
|    | blue | 指定蓝色值（从0.0到1.0）|
|    | alpha | 指定透明度值（从0.0到1.0）|
返回值 | 无
错误 | 无

[demo](http://127.0.0.1:3000/chapter2/lesson1)

## 指定缓冲区颜色

`gl.clear(buffer)`

将指定缓冲区设定为预定值。如果清空的是颜色缓冲区，那么将使用gl.clearColor()指定的值

||||
|---|-----|----------------|
|参数 | buffer | 制定清空的缓冲区|
|    | gl.COLOR_BUFFER_BIT | 指定颜色缓存|
|    | gl.DEPTH_BUFFER_BIT | 指定深度缓冲区|
|    | gl.STENCIL_BUFFER_BIT | 指定模版缓冲区|
返回值 | 无
错误 | INVALID_VALUE | 缓冲区不是以上三种类型

[demo](http://127.0.0.1:3000/chapter2/lesson1)

## 初始化着色器

`initShaders(gl, vshader, fshader)`

在WebGL系统内部建立和初始化着色器

||||
|---|-----|----------------|
|参数 | gl | 指定渲染上下文|
|    | vshader | 指定定点着色器程序代码|
|    | fshader | 指定片元着色器程序代码|
|返回值 | true | 初始化着色器成功|
|      | false | 初始化着色器失败|

### 顶点着色器

控制点的位置和大小

### 顶点着色器内置变量

|||
|-----------------|-------|
|vec4 gl_Position | 表示定点位置|
|float gl_PointSize | 表示点的尺寸|

**gl_Position**变量必须被赋值，否则着色器将无法工作。相反，**gl_PointSize**不是必须的，默认为1.0。

### 变量

将数据从javascript传给顶点着色器，有两种方式: **attribute**和**uniform**

attribute用来传输与顶点相关的数据

uniform用来与顶点无关的不变数据

### 片元着色器

控制点的颜色

[demo](http://127.0.0.1:3000/chapter2/lesson2)

### 片元着色器内置变量

|||
|-----------------|-------|
|vec4 gl_FragColor | 指定片元颜色RGBA|

## 绘制

`gl.drawArrays(mode, first, count)`

执行顶点着色器，按照mode参数指定的方式绘制

||||
|---|-----|----------------|
|参数 | mode | 指定绘制方式，eg: gl.POINTS, gl.LINES gl.LINE_STRIP gl.LINE_LOOP gl.TRIANGLES gl.TRIANFLE_STRIP gl.TRANGLE_FAN|
|    | first | 指定起始绘制点|
|    | count | 指定绘制点的个数|
|返回值 | 无 | |
|错误 | INVALID_ENUM | 传入mode参数错误 |
| | INVALID_VALUE | first和count参数错误 |

## WebGL坐标系

WebGL使用的是三位坐标系统(笛卡尔坐标系)，面向计算机屏幕时，X轴水平向右，Y轴垂直向上，Z轴垂直屏幕向外。

[demo1](http://127.0.0.1:3000/chapter2/lesson3)
[demo2](http://127.0.0.1:3000/chapter2/lesson4)
