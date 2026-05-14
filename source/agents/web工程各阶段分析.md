# web工程各阶段分析
web工程(包含 web页面、android app、小程序、公众号等前端;  api服务等后端) 
从 需求获取 、需求分析、ui设计、系统设计、架构设计、编码、测试(单元测试、集成测试、验收测试) 等角度 思考如下 问题
1、当下各种 插件(指的是  打包了skill、mcp、hook等功能的插件) 如何使用在这些角度中来
2、每个角度下 如何更好充分利用 这些插件
3、不要最好的插件组合，只要最合适的插件组合
4、每个角度 如何测评 哪些插件更合适

以下从 Web工程全生命周期 的7个核心阶段出发，围绕你定义的“插件”（打包了Skill、MCP、Hook等能力的自动化/智能扩展组件），
逐一回答：如何使用、如何充分利用、如何选最合适的组合、如何测评适配度。
内容聚焦工程落地，避免“唯AI论”，强调场景匹配度、集成成本、可维护性与ROI

> Skill：原子化AI能力（如代码补全、用例生成、设计稿解析、架构推演等）
> MCP（Model Context Protocol）：标准化协议，用于插件安全、受控地访问项目上下文（代码库、API契约、设计系统、日志、需求库等）
> Hook：事件触发器（如Git提交、CI流水线、Figma导出、需求变更通知等），实现插件与研发流无缝嵌入
> “最合适” ≠ “最强”：取决于团队规模、技术栈、合规要求、遗留系统兼容性、运维成本。

## 需求获取
|维度|说明
|-|-
|如何使用|语音/会议转写插件自动提取关键诉求；用户反馈/埋点数据聚合插件识别高频痛点；竞品分析插件输出结构化对比表。
|如何充分利用|通过Hook监听飞书/钉钉会议录制、客服工单、GA/神策事件；通过MCP打通需求池（Jira/Teambition）与历史PRD；Skill负责去重、归类、打标签、生成初步需求卡片。
|合适组合原则|低侵入采集 + 业务语义对齐 + 权限隔离。优先选支持私有化部署、可配置过滤规则的插件，避免原始数据外泄。
|测评方法|① 信息捕获完整率（对比人工记录）\n② 语义归类准确率（抽样人工复核）\n③ 集成耗时（接入现有协作工具的天数）\n④ 合规审计通过率（数据出境/脱敏策略）

## 需求分析
|维度|说明
|-|-
|如何使用|矛盾检测插件识别需求冲突；优先级推演插件输出MoSCoW/Kano模型；用户故事生成插件自动拆分Epic→Story。
|如何充分利用|MCP连接历史需求库、技术债务清单、业务规则引擎；Hook在PRD更新时自动触发一致性检查；Skill输出可追溯矩阵（需求→功能→验收标准）。
|合适组合原则|强规则约束 + 领域知识可注入 + 可解释输出。避免黑盒决策，优先选支持自定义业务词典、可输出推理链路的插件。
|测评方法|① 需求返工率下降幅度（迭代前后对比）\n② 冲突漏检率（测试阶段暴露的需求矛盾）\n③ 分析师采纳率（实际用于评审的插件输出占比）\n④ 可解释性评分（业务方能否理解推导逻辑）

## UI设计
|维度|说明
|-|-
|如何使用|设计稿解析插件提取组件树与布局参数；多端适配插件生成Web/Android/小程序/公众号的响应式结构；无障碍/对比度检测插件自动校验。
|如何充分利用|Hook监听Figma/蓝湖导出事件；MCP同步Design Token与内部组件库；Skill输出平台差异清单（如小程序不支持CSS变量、Android需适配暗色模式）。
|合适组合原则|平台兼容性优先 + 组件库强绑定 + 输出可版本化。避免“通用型AI出图”，选支持团队Design System映射、可回滚历史版本的插件。
|测评方法|① 设计还原误差率（UI走查偏差点数）\n② 多端适配覆盖率（各平台组件映射完整度）\n③ 交接耗时（设计→前端切图/标注时间）\n④ 无障碍合规通过率（WCAG/国标）

## 系统设计
|维度|说明
|-|-
|如何使用|API契约生成插件输出OpenAPI/GraphQL Schema；数据建模插件生成ERD与索引建议；状态流转插件输出时序图/状态机。
|如何充分利用|MCP接入内部网关、数据库字典、历史接口文档；Hook在架构评审前自动校验命名规范、版本兼容性、幂等性；Skill补充异常流与降级策略。
|合适组合原则|契约先行 + 约束可配置 + 与CI联动。优先选支持Swagger/Postman导入、可绑定团队编码规范的插件，避免过度抽象。
|测评方法|① 契约覆盖率（实际开发接口与插件输出匹配度）\n② 设计评审周期缩短率\n③ 接口变更连锁影响识别准确率\n④ 与现有网关/注册中心集成稳定性

## 架构设计
|维度|说明
|-|-
|如何使用|拓扑推演插件输出部署架构（网关/服务/缓存/消息队列）；威胁建模插件生成STRIDE矩阵；容量规划插件模拟峰值QPS与资源瓶颈。
|如何充分利用|MCP拉取云厂商API、监控历史数据、成本账单；Hook在架构定稿前触发安全/成本/合规校验；Skill输出多方案对比（如Serverless vs 容器化）。
|合适组合原则|数据驱动 + 成本可量化 + 合规内置。避免纯理论推演，选支持接入真实监控数据、可输出TCO/SLA预估的插件。
|测评方法|① 架构决策可追溯性（ADR覆盖率）\n② 容量预估误差率（上线后实际峰值 vs 插件预测）\n③ 安全漏洞前置发现数\n④ 架构评审通过率（一次过审比例）

## 编码
|维度|说明
|-|-
|如何使用|上下文感知补全插件生成业务逻辑；跨端同步插件（Taro/UniApp/React Native）输出多平台代码；API客户端生成插件对接契约。
|如何充分利用|Hook绑定Pre-commit/CI；MCP索引内部SDK、最佳实践、历史PR；Skill支持增量生成、冲突检测、单元测试骨架输出。
|合适组合原则|强类型约束 + 框架特异性支持 + 人工可干预。优先选支持AST解析、可配置生成模板、不破坏Git历史的插件。
|测评方法|① 代码质量指标（SonarQube重复率/漏洞数/圈复杂度变化）\n② 生成代码可用率（直接合并PR占比）\n③ 多端代码一致性差异数\n④ 开发者干预频次（修改AI生成代码的行数比）

## 测试（单元/集成/验收）
|维度|说明
|-|-
|如何使用|用例生成插件输出边界条件；契约测试插件校验前后端接口；多端UI自动化插件录制/回放操作；Mock数据插件生成真实分布数据。
|如何充分利用|Hook监听代码推送/环境部署；MCP同步测试环境配置、历史缺陷库、业务规则；Skill自动标注高风险路径、生成回归用例集。
|合适组合原则|契约绑定 + 环境隔离 + 可维护性。避免“录制回放依赖DOM结构”，选支持API优先、数据驱动、支持多端并行执行的插件。
|测评方法|① 测试覆盖率提升幅度（行/分支/接口）\n② 缺陷逃逸率（线上漏测数/迭代）\n③ 用例执行稳定性（Flaky Test比例）\n④ 维护成本（用例随需求变更的更新工时）

## 跨阶段通用测评框架
|维度|测评方法|合格线参考
|-|-|-
|场景匹配度|用历史项目10%真实数据做沙箱验证，输出准确率/覆盖率|≥85%
|集成成本|统计接入现有工具链（Git/CI/Jira/Figma/云管）的人天|≤5人天/插件
|可控性|是否支持规则注入、输出可解释、权限隔离、审计日志|全量支持
|ROI|（减少工时 + 缺陷下降价值）/（授权费 + 运维成本）|≥2.0

> 落地建议：
> 先Hook后Skill：用Hook把插件嵌入现有流水线，验证数据流与权限边界，再开放AI生成能力。
> MCP最小权限原则：插件只能读取所需上下文（如只读Jira特定项目、只索引内部公开SDK），禁止全库扫描。
> 灰度策略：每个阶段选1个核心插件试点1个模块，跑通3个迭代后再横向推广。
> 建立“插件契约”：规定输入格式、输出Schema、失败降级策略、人工复核节点，避免黑盒依赖。


## 举例
基于 Vue(前端) + Python(后端) + GitLab(CI/CD) + 飞书(需求/协作) 的技术栈，以下为适配Python生态的插件集成方案。核心逻辑不变，但替换了Go特有工具链，并针对Python动态类型、包管理、异步生态做了工程化调优，确保“最适配、可度量、低侵入”。

### 核心集成拓扑（数据流向）
```plain
飞书 ──Hook/MCP──▶ 需求插件群 ──▶ 飞书任务/PRD
                                      │
                                      ▼
Figma/蓝湖 ──Hook──▶ UI插件群 ──MCP(Token/GitLab)──▶ Vue组件骨架
                                      │
                                      ▼
Pydantic/FastAPI ──Hook──▶ 系统/架构插件群 ──MCP(GitLab/监控/依赖)──▶ OpenAPI/ADR/安全报告
                                      │
                                      ▼
IDE(VSCode/PyCharm) ──Hook──▶ 编码插件群 ──MCP(私有包/类型提示/历史MR)──▶ PR提交
                                      │
                                      ▼
GitLab CI ──Hook──▶ 测试插件群 ──MCP(契约/缺陷库/环境)──▶ 飞书测试报告/阻断通知
```

### 7阶段落地矩阵（Vue+Python+GitLab+飞书定制版）
|阶段|最合适插件组合|Hook触发点|MCP上下文源|Skill能力输出|测评方法（合格线）|为何最适配
|-|-|-|-|-|-|-
|1. 需求获取|飞书开放平台录音转写 + 自研轻量MCP Server(业务词典) + 飞书Bot卡片生成器|会议结束/飞书文档@提及/客服工单创建|飞书日历/转写API、历史需求库、产品术语表|语音去噪→关键诉求抽取→自动生成飞书任务卡片(含标签/优先级)|信息遗漏率≤5%|转写准确率≥90%|接入耗时≤2人天|飞书原生API稳定，MCP仅读不写，满足合规；避免采购重型会议纪要SaaS
|2. 需求分析|飞书多维表格自动化 + 规则校验插件(DooTask/自研) + AC生成Skill|多维表格状态变待评审/PRD版本更新|历史需求冲突记录、技术债务清单、飞书文档|冲突检测→MoSCoW排序→用户故事拆分→验收标准(AC)草案|需求返工率↓≥20%|冲突检出率≥85%|分析师采纳率≥70%|强绑定飞书工作流；规则引擎保底线，Skill仅做草案，人工终审
|3. UI设计|Figma Dev Mode + Token Sync MCP Plugin + Vue SFC生成Skill|Figma设计稿发布/蓝湖标注导出|Design Token仓库(GitLab)、Vue内部UI库、多端适配规则|布局转Vue骨架→暗色/小程序语法降级提示→无障碍校验报告|设计还原偏差≤3%|交接时间↓50%|多端映射覆盖率≥95%|Token走GitLab版本化，Skill仅生成可覆盖的模板代码，不替代手写
|4. 系统设计|FastAPI + Pydantic + openapi-generator + CI契约Hook|Pydantic模型提交/GitLab MR创建|Python类型注解、Vue axios层、历史接口、网关路由|OpenAPI自动导出→前后端TS/Python Client生成→异常流补全|契约覆盖≥90%|联调阻塞↓60%|生成可用≥85%|Python强推契约驱动：Pydantic天然映射OpenAPI，零额外注释成本
|5. 架构设计|GitLab CI合规(Checkov+bandit+pip-audit) + 监控MCP + ADR Skill|uv.lock/pyproject.toml变更/服务部署|Prometheus/prometheus-client、云账单、Python依赖图|QPS/延迟推演→STRIDE→多方案TCO→ADR草案|评审一次过↑30%|容量误差≤15%|安全拦截≥90%|聚焦Python特有风险：依赖供应链(pip-audit)、GIL/异步瓶颈、第三方包漏洞
|6. 编码|Continue.dev + Python MCP Server + pre-commit(ruff/mypy)|IDE保存/Pre-commit/GitLab Push|src/、tests/、类型提示、历史MR、OpenAPI契约|上下文补全→pytest骨架→类型修正→规范建议|Sonar重复↓20%|AI合并≥40%|修改行比≤1:3|强类型约束(mypy)过滤AI幻觉；ruff秒级拦截格式/安全漏洞
|7. 测试|pytest + pact-python + Playwright + Mock Skill|代码合并至develop/测试环境部署|缺陷追踪(飞书)、API契约、DB Schema、历史Flaky用例|边界用例生成(hypothesis)→动态Mock→Flaky根因→回归集|接口覆盖↑25%|缺陷逃逸≤2%|Flaky≤5%|维护↓40%|Python生态成熟：pytest插件化、hypothesis自动探边界、FastAPI TestClient无缝集成

### “最合适”组合的落地铁律
- 类型先行：所有AI生成代码必须包含 typing 标注与 Pydantic 模型。MCP索引优先解析 *.pyi、pydantic 定义，Skill拒绝生成无类型约束的动态代码。
- 依赖隔离：使用 uv 或 poetry 锁定依赖版本。MCP仅读取 uv.lock/pyproject.toml，禁止AI动态安装第三方包
- 静态强卡点：CI流水线必须前置 ruff check + mypy --strict + bandit -ll。AI生成内容未通过静态扫描直接阻断MR
- 异步/并发显式化：Skill输出涉及IO/网络调用时，强制使用 asyncio/httpx/aiomysql 等现代异步栈，避免阻塞型 requests/time.sleep。
- 测试契约化：前端Vue与Python后端必须通过 OpenAPI 契约绑定。pact-python 验证消费者驱动契约，Skill仅补充异常路径Mock。
- MCP最小权限原则：
> 需求MCP：只读飞书指定项目/空间
> 代码MCP：只索引internal/、pkg/、历史MR diff
> 测试MCP：只读test/、契约文件、缺陷看板
> 禁止全库扫描或直连生产库
- Skill输出必须可干预：所有AI生成内容以 PR Draft / 飞书评论 / CI Artifacts 形式交付，强制人工Approve后才合并。
- 成本可控：优先选开源/自建MCP Server（如 modelcontextprotocol/python-sdk + Go MCP Server），商业插件仅用于飞书/Figma原生不支持的环节。

### 30-60-90天灰度推进路线
|周期|目标|动作|成功标志
|-|-|-|-
|0-30天|跑通数据链|部署 mcp-python-sdk；配置 ruff/mypy/pytest CI阶段；接入1个FastAPI服务+1个Vue模块|Hook触发≥99%\n静态扫描拦截率100%\nMCP读取延迟<300ms
|31-60天|验证Skill ROI|开放Pydantic模型生成、pytest用例生成、契约对齐Skill；设置人工复核；采集基线|AI输出采纳率≥60%\n联调耗时↓30%\n无类型运行时错误
|61-90天|横向推广|将验证通过的插件组合封装为 GitLab CI Template + 飞书自动化蓝图；建立插件淘汰机制(连续2迭代ROI<1.5则下线)|全团队覆盖≥80%模块\n缺陷逃逸率≤2%\nROI稳定≥2.0

### .gitlab-ci.yml Python专属阶段（含插件Hook卡点）
```yaml
stages:
  - lint
  - contract
  - test
  - security
  - deploy

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"
  UV_CACHE_DIR: "$CI_PROJECT_DIR/.cache/uv"

lint:
  stage: lint
  image: python:3.12-slim
  before_script:
    - pip install uv
    - uv sync --frozen
  script:
    - uv run ruff check src/ tests/
    - uv run mypy --strict src/
  artifacts:
    reports:
      junit: test-results/lint-junit.xml

contract-check:
  stage: contract
  image: python:3.12-slim
  script:
    - uv run python -m openapi_generator --input src/models.py --output openapi.json
    - uv run pact-python verify --consumer web --provider api --pact-url openapi.json
  only:
    - merge_requests

test:
  stage: test
  image: python:3.12-slim
  script:
    - uv run pytest tests/ --cov=src --cov-report=xml
    - uv run hypothesis tests/property/
  coverage: '/^TOTAL.*\s+(\d+)%$/'
```

### Python MCP Server 最小配置（mcp_server.py）
```python
from mcp.server.fastmcp import FastMCP
import ast
import json

mcp = FastMCP("python-backend-context")

@mcp.tool()
def get_project_types(file_path: str) -> dict:
    """提取指定Python文件的类型注解与Pydantic模型"""
    # 实际实现：ast解析 + pydantic-core 提取结构
    return {"status": "ok", "types": []}  # 示例返回

@mcp.tool()
def get_openapi_schema() -> dict:
    """读取FastAPI自动生成的OpenAPI契约"""
    return {"status": "ok", "schema": {}}

if __name__ == "__main__":
    mcp.run()
```

