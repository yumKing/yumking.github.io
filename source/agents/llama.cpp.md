# llama.cpp 使用

## 安装
windows10 github release直接下载安装包，cuda12的，还要下载cuda12的算法包，并将结果放入解压后的安装路径下

## llama-cli使用
```bash
 # -grammaer-file 已经过时
 llama-cli.exe' -m  .\qwen2.5-3b-instruct-q4_k_m.gguf --grammar-file .\json.gbnf -sysf .\system-prompt.txt -temp 0.1

 # 使用 --json-shcema-file -jf
 llama-cli.exe' -m  .\qwen2.5-3b-instruct-q4_k_m.gguf --json-schema-file .\openai-shcema.json -sysf .\system-prompt.txt -temp 0.1

 # cnv 多轮对话
 llama-cli.exe' -m  .\qwen2.5-3b-instruct-q4_k_m.gguf --json-schema-file .\openai-shcema.json -sysf .\system-prompt.txt -temp 0.1 -cnv
```

## llama-server使用
```bash

# 系统提示词 代码中动态添加, openai 会自动处理
llama-server.exe -m  .\qwen2.5-3b-instruct-q4_k_m.gguf -jf .\schema.json --jinja

# 固定系统提示词
llama-server.exe -m  .\qwen2.5-3b-instruct-q4_k_m.gguf -jf .\schema.json --jinja --sysf .\system-prompt.txt

# 只web上使用，则去掉 -jf
llama-server.exe -m  .\qwen2.5-coder-3b-instruct-q5_k_m.gguf --jinja -jf .\schema.json --temp 0.7 --top-k 40 --top-p 0.9 -ngl 99 --ctx-size 4096 --batch-size 512 --ubatch-size 128 --repeat-penalty 1.1  --port 8054 -v  --log-file qwen.log
```

## llama 视觉模型加载 
```bash
llama-cli -m Qwen2.5-VL-3B-Instruct-Q8_0.gguf --mmproj mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf  -p "Describe this image." --image ./car-1.jpg

llama-server.exe -m  Qwen2.5-VL-3B-Instruct-Q8_0.gguf  --mmproj mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf --jinja --temp 0.7 --top-k 40 --top-p 0.9 -ngl 99 --ctx-size 4096 --batch-size 512 --ubatch-size 128 --repeat-penalty 1.1  --port 8054 
```

## llama-server 工作流程
```text
1. 你的请求
   {"messages": [{"role":"user", "content": [
      {"type":"image_url", "image_url":{"url":"image/jpeg;base64,..."}},
      {"type":"text", "text":"这张图有什么？"}
   ]}]}

2. llama-server 接收并解析
   ├─ 识别到 image_url → 解码为 numpy 图像数组
   ├─ 送入内置的 Vision Encoder (ViT) → 输出图像特征图
   ├─ 经过投影层 (MLP) → 转为视觉 token 序列 (e.g. 1024 个 token IDs)
   └─ 读取 chat template，找到占位符 <|image_pad|>

3. Token 替换与拼接
   原始模板输出:  ...<|im_start|>user\n<|image_pad|>这张图有什么？<|im_end|>\n...
   替换后序列:    ...<|im_start|>user\n[1024个视觉token ID]这张图有什么？<|im_end|>\n...

4. 送入 LLM
   拼接好的 input_ids + attention_mask → 前向推理 → 生成文本
```

## python openai 格式api使用
```python

import os
import subprocess
from dataclasses import dataclass
import json

try:
    import readline
    # #143 UTF-8 backspace fix for macOS libedit
    readline.parse_and_bind('set bind-tty-special-chars off')
    readline.parse_and_bind('set input-meta on')
    readline.parse_and_bind('set output-meta on')
    readline.parse_and_bind('set convert-meta off')
    readline.parse_and_bind('set enable-meta-keybindings on')
except ImportError:
    pass

from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(override=True)

WORKDIR = Path.cwd()
client = OpenAI(base_url=os.getenv("OPENAI_BASE_URL"), api_key=os.getenv("OPENAIC_API_KEY"))
MODEL = os.environ["MODEL_ID"]

SYSTEM = (
    f"You are a coding agent at {WORKDIR}. Currently in a Windows environment. Terminal shell is cmd"
    "Use bash to inspect and change the workspace. Act first, then report clearly."
)

TOOLS = [
    {
        "function": {
            "description": ("在 Windows 环境中执行系统命令。"
                "⚠️ 严格使用 CMD.exe 或 PowerShell 语法。"
                "🚫 绝对禁止 Linux/bash 命令（如 ls, rm, cat, grep, curl, ps, chmod, awk 等）。"
                "✅ 必须使用 Windows 原生命令或Powershell命令（如 dir, del, type, findstr, ping, tasklist, Get-Process 等）。"
                "📝 路径使用反斜杠 \\，注意空格和引号转义。"),
            "name": "bash",
            "parameters": {
                "properties": {
                    "command": {
                        "type": "string"
                    }
                },
                "required": [
                    "command"
                ],
                "type": "object"
            }
        },
        "type": "function"
    },
    {
        "function": {
            "description": "读文件内容",
            "name": "read_file",
            "parameters": {
                "properties": {
                    "limit": {
                        "type": "integer"
                    },
                    "path": {
                        "type": "string"
                    }
                },
                "required": [
                    "path"
                ],
                "type": "object"
            }
        },
        "type": "function"
    },
    {
        "function": {
            "description": "写内容到文件",
            "name": "write_file",
            "parameters": {
                "properties": {
                    "content": {
                        "type": "string"
                    },
                    "path": {
                        "type": "string"
                    }
                },
                "required": [
                    "path",
                    "content"
                ],
                "type": "object"
            }
        },
        "type": "function"
    },
    {
        "function": {
            "description": "替换文件中的确切文本",
            "name": "edit_file",
            "parameters": {
                "properties": {
                    "new_text": {
                        "type": "string"
                    },
                    "old_text": {
                        "type": "string"
                    },
                    "path": {
                        "type": "string"
                    }
                },
                "required": [
                    "path",
                    "old_text",
                    "new_text"
                ],
                "type": "object"
            }
        },
        "type": "function"
    }
]

def safe_path(p: str) -> Path:
    path = (WORKDIR / p).resolve()
    if not path.is_relative_to(WORKDIR):
        raise ValueError(f"Path escapes workspace: {p}")
    return path

def run_read(path: str, limit: int = None) -> str:
    try:
        text = safe_path(path).read_text(encoding="utf-8")
        lines = text.splitlines()
        if limit and limit < len(lines):
            lines = lines[:limit] + [f"... ({len(lines) - limit} more lines)"]
        return "\n".join(lines)[:50000]
    except Exception as e:
        return f"Error: {e}"


def run_write(path: str, content: str) -> str:
    try:
        fp = safe_path(path)
        fp.parent.mkdir(parents=True, exist_ok=True)
        fp.write_text(content, encoding="utf-8")
        return f"Wrote {len(content)} bytes to {path}"
    except Exception as e:
        return f"Error: {e}"


def run_edit(path: str, old_text: str, new_text: str) -> str:
    try:
        fp = safe_path(path)
        content = fp.read_text(encoding="utf-8")
        if old_text not in content:
            return f"Error: Text not found in {path}"
        fp.write_text(content.replace(old_text, new_text, 1))
        return f"Edited {path}"
    except Exception as e:
        return f"Error: {e}"
    
CONCURRENCY_SAFE = {"read_file"}
CONCURRENCY_UNSAFE = {"write_file", "edit_file"}

# -- The dispatch map: {tool_name: handler} --
TOOL_HANDLERS = {
    "bash":       lambda **kw: run_bash(kw["command"]),
    "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
    "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
    "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"], kw["new_text"]),
}

@dataclass
class LoopState:
    # The minimal loop state: history, loop count, and why we continue.
    messages: list
    turn_count: int = 1
    transition_reason: str | None = None


def run_bash(command: str) -> str:
    dangerous = ["rm -rf /", "sudo", "shutdown", "reboot", "> /dev/"]
    if any(item in command for item in dangerous):
        return "Error: Dangerous command blocked"
    try:
        result = subprocess.run(
            ["powershell", "-Command", command],
            cwd=os.getcwd(),
            capture_output=True, text=True, timeout=120,
            encoding="gbk", errors="ignore"  # Windows 默认编码
        )

        # result = subprocess.run(
        #     command,
        #     shell=True,
        #     cwd=os.getcwd(),
        #     capture_output=True,
        #     text=True,
        #     timeout=120,
        # )
    except subprocess.TimeoutExpired:
        return "Error: Timeout (120s)"
    except (FileNotFoundError, OSError) as e:
        return f"Error: {e}"

    output = (result.stdout + result.stderr).strip()
    return output[:50000] if output else "(no output)"


def execute_tool_calls(tool_calls) -> list[dict]:
    results = []
    for tc in tool_calls:
        
        args = json.loads(tc.function.arguments)
        print(f"\033[33mtool: {tc.function.name} {tc.function.arguments} \033[0m")

        handler = TOOL_HANDLERS.get(tc.function.name)
        output = handler(**args) if handler else f"Unknown tool: {tc.function.name}"
        print(output[:200])
        print()
        results.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "content": output,
        })
    return results


def run_one_turn(state: LoopState) -> bool:
    response = client.chat.completions.create(
        model=MODEL,
        messages=state.messages,
        tools=TOOLS,
        tool_choice="auto",
        temperature=0.1,
        max_tokens=1024,
    )

    choice = response.choices[0]
    msg = choice.message
    
    if choice.finish_reason != "tool_calls":
        state.transition_reason = None
        state.messages.append({"role": "assistant", "content": msg.content})
        return False
    
    # state.messages.append({"role": "assistant", "tool_calls": []})
    # state.messages.append(msg)
    state.messages.append(msg.model_dump())
    results = execute_tool_calls(msg.tool_calls)
    if not results:
        state.transition_reason = None
        return False
    
    state.messages.extend(results)

    state.turn_count += 1
    state.transition_reason = "tool_result"
    return True


def agent_loop(state: LoopState) -> None:
    while run_one_turn(state):
        pass


if __name__ == "__main__":
    history = []
    history.append({"role": "system", "content": SYSTEM})
    while True:
        try:
            query = input("\033[36ms01 >> \033[0m")
        except (EOFError, KeyboardInterrupt):
            break
        if query.strip().lower() in ("q", "exit", ""):
            break

        history.append({"role": "user", "content": query})
        state = LoopState(messages=history)
        agent_loop(state)

        final_text = history[-1]["content"]
        if final_text:
            print(final_text)
        print()

```