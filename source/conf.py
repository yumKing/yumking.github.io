# 让 Sphinx 使用相对路径，避免 GitHub Pages 子目录 404
html_baseurl = "https://yumking.github.io/"
html_use_relative_urls = True  # Sphinx 7+ 默认开启，显式声明更稳妥


# ===== 核心配置 =====
extensions = [
    'myst_parser',          # 👈 启用 Markdown 支持
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    # ... 其他扩展
]

# ===== MyST 扩展配置（推荐） =====
myst_enable_extensions = [
    "dollarmath",      # 支持 $...$ 行内公式
    "amsmath",         # 支持 LaTeX 数学环境
    "colon_fence",     # 允许用 ::: 代替 ``` 包裹指令
    "deflist",         # 支持定义列表
    "html_image",      # 支持 HTML 风格图片语法
    "linkify",         # 自动识别网址为链接（需安装 linkify-it-py）
    "substitution",    # 支持变量替换
]

# 可选：设置默认标题层级（避免 Markdown 标题与 Sphinx 标题冲突）
myst_heading_anchors = 3  # 为 H1~H3 自动生成锚点链接

# 可选：定义全局替换变量（在 .md 中用 {{ variable }} 引用）
myst_substitutions = {
    "project": "MyProject",
    "version": "1.0.0",
}