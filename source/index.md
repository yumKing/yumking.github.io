(home-label)=
# 📒 yumKing笔记本
记录日常笔记、技术问题排查与深度思考，打造你的个人知识第二大脑。

:::{button-link} getting_started/index
:color: primary
:shadow:
🚀 快速开始
:::

---

## 📚 文档导航
::::{grid} 1 2 2 3
:gutter: 3

:::{grid-item-card} 🛠️ 快速入门
:link: getting_started/index
环境配置 · 基础用法 · 核心概念
:::

:::{grid-item-card} 📖 用户指南
:link: user_guide/overview
详细教程 · 最佳实践 · 常见问题
:::

:::{grid-item-card} 🧪 验证测试
:link: verify_test/index
测试流程 · 用例管理 · 结果分析
:::

:::{grid-item-card} 🤖 Agent 实践
:link: agents/index
智能体配置 · 工作流 · 扩展开发
:::

:::{grid-item-card} 🗃️ 其它文档
:link: others/index
归档资料 · 临时记录 · 参考资料
:::
::::

---

## 🛠️ 索引与工具
* {ref}`genindex`
* {ref}`modindex`
* {ref}`search`

<!-- 
  📌 隐藏的 toctree：Sphinx 构建左侧侧边栏导航必需。
  设为 :hidden: 可避免页面正文重复显示列表，保持现代 UI 整洁。
-->
```{toctree}
:maxdepth: 2
:caption: 目录
:hidden:

快速入门 <getting_started/index>
用户指南 <user_guide/overview>
验证测试 <verify_test/index>
agent <agents/index>
其它文档 <others/index>
```