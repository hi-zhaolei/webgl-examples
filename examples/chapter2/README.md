# Chapter 2

## getWebGLContext(element,[, debug])

获取WebGL上下文，如果开启了debug属性，遇到错误时将在控制台显示错误消息

||||
----|---------|------------
参数 | element | 制定canvas元素
    | debug | 默认为false, 如果设置为true，控制台将现实错误，会影响性能
返回值 | non-null | WebGL上下文
      | null | WebGL不可用

## gl.clearColor(red, green, blue, alpha)

制定绘图区域背景色

||||
---|-----|----------------
参数 | red | 指定红色值（从0.0到1.0）
    | green | 指定绿色值（从0.0到1.0）
    | blue | 指定蓝色值（从0.0到1.0）
    | alpha | 指定透明度值（从0.0到1.0）
返回值 | 无
错误 | 无

## gl.clear(buffer)

将指定缓冲区设定为预定值。如果清空的是颜色缓冲区，那么将使用gl.clearColor()指定的值

||||
---|-----|----------------
参数 | buffer | 制定清空的缓冲区
    | gl.COLOR_BUFFER_BIT | 指定颜色缓存
    | gl.DEPTH_BUFFER_BIT | 指定深度缓冲区
    | gl.STENCIL_BUFFER_BIT | 指定模版缓冲区
返回值 | 无
错误 | INVALID_VALUE | 缓冲区不是以上三种类型

## initShaders(gl, vshader, fshader)

在WebGL系统内部建立和初始化着色器

||||
---|-----|----------------
参数 | gl | 指定渲染上下文
    | vshader | 指定定点着色器程序代码
    | fshader | 指定片元着色器程序代码
返回值 | true | 初始化着色器成功
      | false | 初始化着色器失败


## 顶点着色器内置变量

|||
-----------------|-------
vec4 gl_Position | 表示定点位置
float gl_PointSize | 表示点的尺寸

**gl_Position**变量必须被赋值，否则着色器将无法工作。相反，**gl_PointSize**不是必须的，默认为1.0。
