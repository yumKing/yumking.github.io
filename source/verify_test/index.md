# 验证测试

<!-- 跨文档引用（MyST 增强语法） -->
<!-- 引用其他 .md/.rst 文件的标题 -->
{ref}`快速入门 <getting_started/index>`

<!-- 引用任意位置的标签（推荐在目标文件顶部加 (label)=）-->
(label-target)=
## 目标章节

在其他文件中引用：{ref}`label-target`

<!-- 引用文档（自动使用目标文档标题）-->
{doc}`getting_started/index`

<!-- 使用 Sphinx 指令1（如 note/warning/toctree） -->
```{note}
这是一个提示框，会渲染为 Sphinx 的 admonition 样式。
```

```{toctree}
:maxdepth: 2
getting_started/index
user_guide/overview
```

<!-- 使用 Sphinx 指令2（如 note/warning/toctree） -->
:::{note}
这是一个提示框，会渲染为 Sphinx 的 admonition 样式。
:::

:::{toctree}
:maxdepth: 2
getting_started/index
user_guide/overview
:::