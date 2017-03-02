# webgl-examples
some webgl examples for WebGL Programming Guide

### WebGL方法统计
* 获取WebGL变量存储地址
  函数规范: `gl.get[Uniform|Attrib]Location(program, name)`
  参数:    program   指定包含丁着色器和片元着色器的程序对象
          name      指定想要获取其存储位置的变量名称
  返回值:  non-null  指定变量位置
          null      指定变量不存在，或者其命名具有gl_或webgl_前缀
  错误:    INVALID_OPERATION  程序对象未能成功连接
          INVALID_VALUE  name参数的长度大于uniform变量名的最大长度，默认256字节
* 变量赋值：`gl.[vertexAttrib|uniform][1234]f()`
  函数规范：`gl.[vertexAttrib|uniform][1234]f(location, v0, {v1}, {v2}, {v3})`
  参数:   location  指定attribute变量的存储位置
          v0,v1,v2,v3   指定传输给attribute变量的四个分量的值
  返回值:  无
  错误:    INVALID_VALUE  location大于等于attribute变量的最大数目，默认为8
* 执行顶点着色器: `gl.drawArrays()`
  函数规范:   `gl.drawArrays(mode, first, count)`
  参数:   mode    指定绘制的方式，可接受以下常量符号
            `gl.POINTS`   一系列的点，绘制在v0 v1 v2.....处
            `gl.LINES`   一系列单独线段， 绘制在(v0, v1), (v2,v3)....如果点是奇数，最后一个点会被忽略
            `gl.LINE_STRIP`    一系列链接的线段，绘制在(v0, v1), (v1,v2)....最后一个点是线段终点
            `gl.LINE_LOOP`   一系列链接的线段，绘制在(v0, v1), (v1,v2)....(vn,v0) 与上面不同，会增加最后一个点到第一个点的线段
            `gl.TRIANGLES`    一系列单独的三角形，绘制在(v0,v1,v2), (v3,v4,v5)....如果点的个数不是3的整数倍，剩下的点数将被忽略
            `gl.TRIANGLE_STRIP`    一系列条带状的三角形，前三个点构成了第一个三角形，从第二个点开始的三个点构成第2个三角形, (v0, v1, v2), (v2,v1,v3)
            `gl.TRIANGLE_FAN`   一系列三角形做成的类似于扇形的图形,前三个点构成一个三角形，接下来的一个点和前一个三角形的最后一条边组成接下来的一个三角形
                                  这些三角形被绘制在(v0,v1,v2),(v0,v2,v3),(v0,v3,v4).....处
         first    指定从按个顶点开始绘制
         count    指定绘制需要多少个顶点
* 创建缓存对象 `gl.createBuffer()`
  函数规范：`gl.createBuffer()`
  参数:    无
  返回值:  非null  新创建的缓存区对象
          null     创建缓存区对象失败
  错误:    无
* 删除缓存区对象 `gl.deleteBuffer()`
  函数规范：`gl.deleteBuffer(buffer)`
  参数：buffer    待删除的缓存区对象
  返回值:    无
  错误：     无
* 绑定缓存区：`gl.bindBuffer()`
  将缓存区对象绑定到WebGL系统中已经存在的**target**上。这个**target**表示缓冲区对象的用途，只有这样WebGL才能正确处理其中的内容。
  函数规范：`gl.bindBuffer(target, buffer)`
  参数：   target    参数可以试一下中的一个
            `gl.ARRAY_BUFFER`    表示缓冲区对象中包含了顶点的数据
            `gl.ELEMENT_ARRAY_BUFFER`    表示缓冲区对象中包含了顶点的索引值
          buffer    指定之前由`gl.createBuffer()`创建的对象，如果指定为null，则禁用对target的绑定
  返回值:  无
  错误:    INVALID_ENUM    **target**不是上述值之一，这时将保持原有的绑定情况不变
* 向缓冲区对象写入数据： `gl.bufferData()`
  开辟空间并向缓冲区中写入数据
  函数规范：`gl.bufferDate(target, data, usage)`
  参数：   target    `gl.ARRAY_BUFFER`或`gl.ELEMENT_ARRAY_BUFFER`
          data      写入缓冲区对象的数据，类型化数组
          usage     表示程序将如何使用存储在缓冲区对象中的数据。该参数将帮助WebGL优化操作，但是就算你传入了错误的值，也不会终止程序
            `gl.STATIC_DRAW`    只会像缓冲区对象中写入一次数据，但需要绘制很多次
            `gl.STREAM_DRAW`    只会像缓冲区对象中写入一次数据，然后绘制若干次
            `gl.DYNAMIC_DRAW`    会像缓冲区中多次写入数据，并绘制很多次
  返回值:  无
  错误：   INVALID_ENUM        target不是上述值之一，这时将保持原有的绑定情况不变
* 将缓冲区对象分配给attribute变量：`gl.vertexAttribPointer()`
  函数规范: `gl.vertexAttribPointer(location, size, type, normalized, Astrid, offset)`
  参数:    location    指定待分配**attribute**变量的存储位置
          size        指定缓冲区中每个顶点的分量个数（1到4）。若**size**比**attribute**变量需要的分量数小，缺失的分量将按照与`gl.vertexAttrib[1234]f()`
                      相同规则不全。
          type        用一下类型之一来指定数据格式
            `gl.UNSIGNED_BYTE`  无符号字节, **Unit8Array**
            `gl.SHORT`  短整数, **Int16Array**
            `gl.UNSIGNED_SHORT`  无符号短整数, **Unit16Array**
            `gl.INT`  整数, **Int32Array**
            `gl.UNSIGNED_INT`  无符号整数, **Unit32Array**
            `gl.FLOAT`  浮点数, **Float32Array**
          normalized  传入true或false，表明是否将浮点型的数据归一化道[0,1]或[-1,1]区间
          stride      指定相邻两个顶点间的字节数，默认为0
          offset      指定缓冲区对象中的偏移量（以字节为单位）
  返回值:  无
  错误:    INVALID_OPERATION  不存在当前程序对象
          INVALID_VALUE       **location**大于等于**attribute**变量的最大数目（默认为8）又或者stride或offset为负值
* 开启attribute变量
  函数规范: `gl.enableVertexAttribArray(location)`
  参数: location  制定**attribute**变量的存储位置
  返回值:  无
  错误:    INVALID_VALUE  **location**大于等于**attribute**变量的最大数目，默认为8
* 关闭attribute变量
  函数规范: `gl.disableVertexAttribArray(location)`
  参数: location  制定**attribute**变量的存储位置
  返回值:  无
  错误:    INVALID_VALUE  **location**大于等于**attribute**变量的最大数目，默认为8

### WebGL变量命名规范
WebGL变量声明需要按照<存储限定符><类型><变量名>这个格式来声明

### WebGL相关函数命名规范
WebGL函数命名遵循OpenGL ES2.0中的函数名，OpenGL中的函数名由三个部分组成：<基础函数名><参数个数><参数类型>

