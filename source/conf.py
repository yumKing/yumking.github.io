# 让 Sphinx 使用相对路径，避免 GitHub Pages 子目录 404
html_baseurl = "https://yumking.github.io/"
html_use_relative_urls = True  # Sphinx 7+ 默认开启，显式声明更稳妥

project = "yumKing的笔记本"
author = "yumKing"

# ===== 核心配置 =====
extensions = [
    'myst_parser',          # 👈 启用 Markdown 支持
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx_design',  # 👈 启用现代 UI 组件
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
    "project": project,
    "version": "1.0.0",
}

# 主题配置
html_theme = 'furo'
html_logo = '_static/logo-light.png'  # 默认 Logo
html_favicon = '_static/favicon.png'

html_theme_options = {
    'light_logo': 'logo-light.png',  # 可选
    'dark_logo': 'logo-dark.png',    # 可选
    'sidebar_hide_name': False,      # 显示项目名
    'footer_icons': [                # 底部社交图标
        {'name': 'GitHub', 'url': 'https://github.com/yumKing', 'html': '', 'class': 'fa-brands fa-github'},
    ],
}

# 静态资源路径（放自定义 CSS/图片）
html_static_path = ['_static']
html_css_files = ['custom.css']  # 可选