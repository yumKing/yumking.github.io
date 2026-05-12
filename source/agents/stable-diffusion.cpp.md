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
ffmpeg -loop 1 -t 2 -i f1.jpg -loop 1 -t 1.5 -i f2.jpg -loop 1 -t 1.5 -i f3.jpg \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0[outv]" \
  -map "[outv]" -c:v libx264 -pix_fmt yuv420p output.mp4


# 分段合成
# 第 1 段：2 秒，淡入 0.5s + 淡出 0.5s
ffmpeg -y -loop 1 -i 1.png -t 2 \
  -vf "fade=t=in:st=0:d=0.5,fade=t=out:st=1.5:d=0.5" \
  -c:v libx264 -pix_fmt yuv420p v1.mp4

# 第 2 段：1.5 秒，淡入 0.3s + 淡出 0.3s
ffmpeg -y -loop 1 -i 2.png -t 1.5 \
  -vf "fade=t=in:st=0:d=0.3,fade=t=out:st=1.2:d=0.3" \
  -c:v libx264 -pix_fmt yuv420p v2.mp4

# 第 3 段：1.5 秒，淡入 0.3s + 淡出 0.5s
ffmpeg -y -loop 1 -i 3.png -t 1.5 \
  -vf "fade=t=in:st=0:d=0.3,fade=t=out:st=1.2:d=0.5" \
  -c:v libx264 -pix_fmt yuv420p v3.mp4

# 合并
ffmpeg -y -f concat -safe 0 -i list.txt -c copy output.mp4

## 缩放
ffmpeg.exe -i .\output5.mp4 -vf "scale=256:256:force_original_aspect_ratio=decrease[a]; [a]pad=256:256:0:0:black"  output6.mp4

## 画中画 output5.mp4(512x512) output6.mp4(256x256)
ffmpeg.exe -i .\output5.mp4 -i .\output6.mp4 -filter_complex "[0:v][1:v]overlay=246:246[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p output7.mp4

## 淡入淡出效果
ffmpeg.exe -loop 1 -t 2 -i .\1.png -loop 1 -t 1.5 -i .\2.png -loop 1 -t 1.5 -i .\3.png -filter_complex "[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st=1.5:d=0.5[a];[a][1:v][2:v]concat=n=3:v=1:a=0[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p output2.mp4

## 交叉溶解（Crossfade）- 最常用， 从 前段 到 后段的转场
ffmpeg.exe -loop 1 -t 2 -i .\1.png -loop 1 -t 1.5 -i .\2.png -loop 1 -t 1.5 -i .\3.png -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.3:offset=1.7[a];[a][2:v]xfade=transition=fade:duration=0.3:offset=3.2[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p output4.mp4
### transition 转场类型
#### fade 交叉淡入淡出 
#### wipeleft	从左向右擦除
#### wiperight	从右向左擦除
#### wipeup	从下向上擦除
#### wipedown	从上向下擦除
#### slideleft	左滑入
#### slideright	右滑入
#### slideup	上滑入
#### slidedown	下滑入
#### circlecrop	圆形展开
#### rectcrop	矩形展开
#### distance	3D 距离过渡
#### fadeblack	黑场过渡
#### fadewhite	白场过渡
#### radial	径向展开
#### smoothleft	平滑左滑
#### smoothright	平滑右滑

### duration 转场时长
### offset 转场开时时间 前段时长 - 转场时长

## 常用视频滤镜
### 画质增强
# 锐化
-vf "unsharp=5:5:1.0:5:5:0.0"

# 降噪
-vf "hqdn3d=1.5:1.5:6:6"

# 对比度/亮度/饱和度
-vf "eq=contrast=1.2:brightness=0.05:saturation=1.1"

# 模糊（背景虚化效果）
-vf "boxblur=10:1"

# 边缘检测
-vf "edgedetect=mode=canny"

### 画面调整
# 缩放（保持比例）
-vf "scale=1920:1080:force_original_aspect_ratio=decrease"

# 裁剪
-vf "crop=800:600:100:100"  # 宽：高：x 偏移：y 偏移

# 旋转
-vf "transpose=1"  # 90° 顺时针
-vf "transpose=2"  # 180°
-vf "transpose=3"  # 90° 逆时针

# 翻转
-vf "hflip"  # 水平翻转
-vf "vflip"  # 垂直翻转

# 添加边框
-vf "pad=1920:1080:0:0:black"

### 特效滤镜
# 老电影效果
-vf "curves=vintage,fps=24"

# 黑白
-vf "hue=s=0"

# 反色
-vf "negate"

# 像素化
-vf "scale=iw/10:ih/10,scale=iw*10:ih*10:flags=neighbor"

# 镜像
-vf "split[main][tmp];[tmp]hflip[mirror];[main][mirror]overlay=0:0"

# 画中画
-vf "[main][pip]overlay=1600:800"

### 动态效果
# 缓慢缩放（Ken Burns 效果）
-vf "zoompan=z='min(zoom+0.0015,1.5)':d=900:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080"

# 抖动效果
-vf "crop=iw-20:ih-20:20*sin(5*PI*t)+20:20*sin(3*PI*t)+20"

# 波浪扭曲
-vf "waves=w=0.02:h=0.01:y=0.5:x=0"

# 渐变淡入（替代 fade）
-vf "fade=t=in:st=0:d=1:alpha=1"

### 音频效果（如有配音/背景音乐）
# 淡入淡出
-af "afade=t=in:st=0:d=1,afade=t=out:st=4:d=1"

# 音量调整
-af "volume=1.5"

# 降噪
-af "afftdn=nf=-20"

# 均衡器
-af "equalizer=f=1000:width_type=h:width=100:g=5"

# 混响
-af "aecho=0.8:0.9:1000:0.3"


输入 → 缩放/裁剪 → 色彩调整 → 特效 → 转场 → 淡入淡出 → 编码输出
       ↓          ↓          ↓      ↓        ↓
     scale      eq       unsharp  xfade    fade

原则：
- 先调整分辨率（减少后续计算量）
- 再调整色彩/画质
- 最后加转场/淡入淡出
- 滤镜顺序用逗号, 分隔，多个滤镜链用分号; 分隔
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

