# Model transform

我们从物体坐标系统开始，这是vertex坐标定义的地方。如果我们想移动这些物体，我们需要使用矩阵进行变换。这些矩阵就是模型矩阵（model matrix）。当它与vertices相乘后，我们就能得到新的vertex coordinates。

![Model transform]()

经过model transform后，物体坐标被转换为世界坐标，它决定了物体在场景中的位置