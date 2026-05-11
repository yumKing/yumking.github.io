# stable-diffusion.cpp 使用

## 安装
https://github.com/leejet/stable-diffusion.cpp Release页下载，windows下需要再下一个cudart算法库

如果使用4G 来运行
https://github.com/leejet/stable-diffusion.cpp/wiki/How-to-Use-Z%E2%80%90Image-on-a-GPU-with-Only-4GB-VRAM

## sd-cli使用
```bash

# --offload-to-cpu 仅在计算期间将权重加载到显存中 → 显著降低显存占用，且不损失速度
# --diffusion-fa 启用闪存注意力机制 → 速度更快，内存效率更高
# --vae-conv-direct 降低 VAE 解码期间的 VRAM 使用量
#  --vae-tiling 采用分块式 VAE 处理 → 内存消耗大幅降低
# --clip-on-cpu  允许您在 CPU 上运行 Qwen-3 4B，从而能够处理更高精度的模型。
# 更多命令行参数可在https://github.com/leejet/stable-diffusion.cpp/tree/master/examples/cli找到。

sd-cli.exe --diffusion-model  z_image_turbo-Q3_K.gguf --vae ae.safetensors  --llm Qwen3-4B-Instruct-2507-Q4_K_M.gguf -p "A cinematic, melancholic photograph of a solitary hooded figure walking through a sprawling, rain-slicked metropolis at night. The city lights are a chaotic blur of neon orange and cool blue, reflecting on the wet asphalt. The scene evokes a sense of being a single component in a vast machine. Superimposed over the image in a sleek, modern, slightly glitched font is the philosophical quote: 'THE CITY IS A CIRCUIT BOARD, AND I AM A BROKEN TRANSISTOR.' -- moody, atmospheric, profound, dark academic" --cfg-scale 1.0 -v --offload-to-cpu --diffusion-fa -H 1024 -W 512

```
