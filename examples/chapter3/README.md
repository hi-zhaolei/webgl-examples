# 绘制变换三角形

## 使用缓冲区对象

### 创建

创建的缓冲区对象 `gl.createBuffer()`

* 参数:    无
* 返回值:
  * 非null  新创建的缓存区对象
  * null     创建缓存区对象失败
* 错误:    无

### 删除

删除已创建的缓冲区对象 `gl.deleteBuffer(buffer)`

* 参数:   buffer    待删除的缓存区对象
* 返回值:  无
* 错误:    无

### 绑定

绑定缓存区：`gl.bindBuffer()`

将缓存区对象绑定到WebGL系统中已经存在的**target**上。这个**target**表示缓冲区对象的用途，只有这样WebGL才能正确处理其中的内容。

函数规范：`gl.bindBuffer(target, buffer)`

* 参数:
  * target    参数可以试一下中的一个
    * gl.ARRAY_BUFFER    表示缓冲区对象中包含了顶点的数据
    * gl.ELEMENT_ARRAY_BUFFER    表示缓冲区对象中包含了顶点的索引值
  * buffer    指定之前由`gl.createBuffer()`创建的对象，如果指定为null，则禁用对target的绑定
* 返回值:  无
* 错误:
  * INVALID_ENUM    **target**不是上述值之一，这时将保持原有的绑定情况不变

### 写入数据

向缓冲区对象写入数据： `gl.bufferData()`

开辟空间并向缓冲区中写入数据

函数规范：`gl.bufferDate(target, data, usage)`

* 参数:
  * target **gl.ARRAY_BUFFER**或**gl.ELEMENT_ARRAY_BUFFER**
  * data 写入缓冲区对象的数据，类型化数组
  * usage 表示程序将如何使用存储在缓冲区对象中的数据。该参数将帮助WebGL优化操作，但是就算你传入了错误的值，也不会终止程序
    * **gl.STATIC_DRAW** 只会像缓冲区对象中写入一次数据，但需要绘制很多次
    * **gl.STREAM_DRAW** 只会像缓冲区对象中写入一次数据，然后绘制若干次
    * **gl.DYNAMIC_DRAW** 会像缓冲区中多次写入数据，并绘制很多次
* 返回值:  无
* 错误:
  * INVALID_ENUM target不是上述值之一，这时将保持原有的绑定情况不变

### 分配

将缓冲区对象分配给attribute变量：`gl.vertexAttribPointer()`

函数规范: `gl.vertexAttribPointer(location, size, type, normalized, Astrid, offset)`

* 参数:
  * location    指定待分配**attribute**变量的存储位置
  * size        指定缓冲区中每个顶点的分量个数（1到4）。若**size**比**attribute**变量需要的分量数小，缺失的分量将按照与`gl.vertexAttrib[1234]f()`
                相同规则补全。
  * type        用以下类型之一来指定数据格式
    * **gl.UNSIGNED_BYTE**  无符号字节, **Unit8Array**
    * **gl.SHORT**  短整数, **Int16Array**
    * **gl.UNSIGNED_SHORT**  无符号短整数, **Unit16Array**
    * **gl.INT**  整数, **Int32Array**
    * **gl.UNSIGNED_INT**  无符号整数, **Unit32Array**
    * **gl.FLOAT**  浮点数, **Float32Array**
  * normalized  传入true或false，表明是否将浮点型的数据归一化道[0,1]或[-1,1]区间
  * stride      指定相邻两个顶点间的字节数，默认为0
  * offset      指定缓冲区对象中的偏移量（以字节为单位）
* 返回值:  无
* 错误:
  * INVALID_OPERATION  不存在当前程序对象
  * INVALID_VALUE       **location**大于等于**attribute**变量的最大数目（默认为8）又或者stride或offset为负值

### 开启attribute变量

函数规范: `gl.enableVertexAttribArray(location)`

* 参数:
  * location  指定**attribute**变量的存储位置
* 返回值:  无
* 错误:
  * INVALID_VALUE  **location**大于等于**attribute**变量的最大数目，默认为8

### 关闭attribute变量

函数规范: `gl.disableVertexAttribArray(location)`

* 参数:
  * location  指定**attribute**变量的存储位置
* 返回值:  无
* 错误:
  * INVALID_VALUE  **location**大于等于**attribute**变量的最大数目，默认为8

## 移动 旋转 平移