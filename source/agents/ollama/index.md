# ollama配置本地模型

## ollama 部署 gguf 模型
- 对于老电脑，需要手动编译llama.cpp项目，来支持自己的gpu(如果gpu太老，建议不要试了，浪费时间，换电脑是最好的办法)
- 对于新电脑按照官方文档安装即可
- 编辑llama.cpp项目中的一些问题
1. windows10电脑直接将 vs编辑工具包，且在安装vs工具时，一定要安装上cmake相关联的组件，要不然构建llama.cpp时(使用cmake构建)，会找不到vs相关配置

## 使用 openai 类型api访问ollama部署的模型
```python
import openai

client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama" # 实际上不需要真实的API Key
)

# role: system assistant user
response = client.chat.completions.create(
    model="qwen2.5", # 使用你本地的ollama模型名称
    messages=[
        {"role": "system", "content": "你是一个有用的助手。"},
        {"role": "user", "content": "你好"}
    ]
)
print(response.choices[0].message.content)
```