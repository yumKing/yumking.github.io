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

sd-cli.exe --diffusion-model  z_image_turbo-Q3_K.gguf --vae ae.safetensors  --llm Qwen3-4B-Instruct-2507-Q4_K_M.gguf -p "A cinematic, melancholic photograph of a solitary hooded figure walking through a sprawling, rain-slicked metropolis at night. The city lights are a chaotic blur of neon orange and cool blue, reflecting on the wet asphalt. The scene evokes a sense of being a single component in a vast machine. Superimposed over the image in a sleek, modern, slightly glitched font is the philosophical quote: 'THE CITY IS A CIRCUIT BOARD, AND I AM A BROKEN TRANSISTOR.' -- moody, atmospheric, profound, dark academic" --cfg-scale 1.0 -v --offload-to-cpu --diffusion-fa --vae-tiling -H 1024 -W 512 -steps 8

```

## sd-server使用
```bash
sd-server.exe --diffusion-model  z_image_turbo_bf16.safetensors --vae ae.sft  --llm qwen_3_4b.safetensors --diffusion-fa --offload-to-cpu --vae-tiling -v --cfg-scale 1.0
```


## 一般视频 生成方法（非图生视频模型)
### 步骤
- 根据llm来根据 主题与需求 来生成分镜图片提示词
- 使用 文生图模型 将分镜关键帧图片 生成出来 
- ffmpeg 根据生成的图片 来合成视频 

### 例子

**qwen大模型**
```text
prompt: 
主题： 一位学生在教室座位上安静的读书
需求： 需要5秒的视频，动漫风格，学生选择卡通女孩
```
|项目|内容
|-|-
|主题|学生在教室安静读书
|时长|5 秒
|风格|日系动漫/二次元
|主角|卡通女孩（学生）
|分辨率|1920×1080 (16:9) 或 1080×1920 (9:16 竖屏)

|帧号|时长|画面变化|作用
|-|-|-|-
|帧 1|0-2 秒|女孩低头专注看书|开场定格
|帧 2|2-3.5 秒|女孩微微抬头，眼神柔和|增加动态
|帧 3|3.5-5 秒|女孩嘴角轻扬，阳光洒在脸上|情感收尾

- 帧 1：专注阅读
Anime style, a cute schoolgirl sitting at a classroom desk, reading a book quietly, head slightly bowed, focused expression, soft sunlight streaming through windows, dust particles floating in light beams, empty classroom, wooden desks and chairs, chalkboard in background, warm golden hour lighting, peaceful atmosphere, detailed anime art, Kyoto Animation style, high quality, 8K

- 帧 2：微微抬头
Anime style, a cute schoolgirl sitting at a classroom desk, reading a book, looking up slightly from the book, gentle eyes, soft smile beginning to form, sunlight on her face, classroom interior, windows with curtains, warm afternoon light, peaceful and serene, detailed anime art, Kyoto Animation style, high quality, 8K

- 帧 3：温暖微笑
Anime style, a cute schoolgirl sitting at a classroom desk, holding an open book, gentle warm smile on her face, eyes closed slightly in contentment, golden sunlight illuminating her face and hair, classroom background with soft bokeh, floating dust in light, tranquil mood, detailed anime art, Kyoto Animation style, high quality, 8K

**视频合成过程**
```bash
# 1. 统一图片尺寸
ffmpeg -i frame1.png -vf "scale=1920:1080" f1.jpg
ffmpeg -i frame2.png -vf "scale=1920:1080" f2.jpg
ffmpeg -i frame3.png -vf "scale=1920:1080" f3.jpg

# 2. 合成视频（帧 1 停 2 秒，帧 2 停 1.5 秒，帧 3 停 1.5 秒）
ffmpeg -framerate 1/2 -i f1.jpg -framerate 1/1.5 -i f2.jpg -framerate 1/1.5 -i f3.jpg \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0[outv]" \
  -map "[outv]" -c:v libx264 -pix_fmt yuv420p output.mp4
```

|技巧|效果|实现方式
|-|-|-
|光尘动画|阳光中的尘埃漂浮|后期加粒子特效（AE/剪映）
|书页微动|书本轻微翻动|生成第 4 帧变体，局部替换
|头发飘动|发丝轻微摆动|用 EbSynth 做光流插值
|背景虚化|景深变化|生成时加 depth of field 提示词
|环境音|翻书声/窗外鸟鸣|添加音效库素材


> 如果图片高分辨率生成慢且模糊，可以先生成低分辨率图片，再使用python工具# 2. 用 Real-ESRGAN 放大 2 倍（免费开源）
> pip install realesrgan
> python -m realesrgan.cli -i base_512.png -o final_1024.png --scale 2 --face_enhance