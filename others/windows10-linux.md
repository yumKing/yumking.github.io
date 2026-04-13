# windows10上安装linux子系统

[TOC]

## 前提

需要在windows10上做些配置

设置 -> 控制面板 -> 程序 , 在右侧的程序与功能下打开 **启动或关闭Windows功能**，

在弹出窗中选择 适用于Linux的Windows子系统



## 安装一个linux系统

在 microsoft store 中搜索 **wsl**, 选择你想安装的linux版本，下载 然后打开

在弹出终端中等待安装完成，有时候可能一直在等，这时候可以**Ctrl + C ** 取消，再从

microsoft store 中找到下载的linux打开 ，就可以进入了，如果安装没问题，执行exit退出

在powerShell中 执行 wsl --update, 更新下windows子系统，然后直接执行 wsl就可以进入linux了



## wsl命令的一般操作

```bash
# 以下命令均在Windows PowerShell终端执行
wsl --list --online # 查看可以安装的有效分发linux版本列表
wsl --list --verbose # 查看已经安装的有效分发linux版本列表
wsl --install -d  [可以安装的linux名] #安装想要的linux
wsl -d [已安装的linux名] #进入的linux系统
wsl #进入默认的linux系统, 默认的linux在查看时，前面带有*
wsl --terminate [LINUX NAME] # 终止linux
wsl --unregister [LINUX NAME] # 取消注册linux并删除根文件系统

# 查看windows的物理磁盘标识符
Get-CimInstance -query "select * from win32_diskdrive"
wsl --mount [物理磁盘标识符] # 将windows盘挂载到linux子系统
wsl --unmount [物理磁盘标识符] # 将windows盘 从linux子系统中卸载
```

