# GLSL ES

大小写敏感

每个语句以英文分号结束

必须有且仅有一个main()函数，并且该函数不能有返回值，必须指定返回值。

## 数据值类型

### 数值类型

GLSL ES支持整型数和浮点数

### 布尔值类型

GLSL ES支持布尔值类型，包括true false

## 变量

只能包括a-z,A-Z,0-9和下划线_

变量名不能以数字开头

不能以gl_,webgl_或_webgl_开头

不能是关键字

强类型语言，显式声明变量`<类型> <变量名>`

## 基本类型

类型 | 描述
---|---
float | 单精度浮点数类型。
init | 整数型
bool | 布尔值

###  赋值和类型转换

使用**=**赋值变量，值和变量类型必须相同，可以通过内置类型转换函数进行处理

转换 | 函数 | 描述
---|----|---
转换为整数型 | init(float) | 将浮点数的消暑部分删去，转换为整数型
 | init(bool) | true转换为1，false转换为0
转换为浮点数 | float(init) | 将整数型转换为浮点数(补零)
 | float(bool) | true转换为1.0，false转换为0.0
转换为布尔值 | bool(init) | 0转换为false，其他为true
 | bool(float) | 0.0转换为false，其他为true

### 运算符

GLSL ES支持的运算类型与Javascript类似

进行与(&&)运算时，只有第一个表达式的计算值为true时才会计算第二个表达式。同样，或(||)运算只有第一个表达式为false才会计算第二个。

异或(^^)运算含义是，只有当左右两个表达式中有且仅有一个为true时，运算结果才是true

## 矢量与矩阵

GLSL ES支持矢量和矩阵。他们都包含多个元素，矢量可以表示顶点坐标或颜色值，矩阵用来表示变换矩阵。

类别 | GLSL ES数据类型 | 描述
---|-------------|---
矢量 | vec2 vec3 vec4 | 具有2 3 4个浮点数元素的矢量
 | ivec2 ivec3 ivec4 | 具有2 3 4个整型数元素的矢量
 | bvec2 bvec3 bvec4 | 具有2 3 4个布尔值元素的矢量
矩阵 | mat2 mat3 mat4 | 2\*2 3\*3 4\*4浮点数元素矩阵






