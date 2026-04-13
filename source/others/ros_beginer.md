# ros机器人

## 1. ros软件说明
1. `rosbuild`不建议使用了， 推荐使用`catkin`， 来组织和构建代码
2. 每次新terminal时 ，需要执行 /opt/ros/noetic/setup.bash， 全放在~/.bashrc中
3. rosdep install [package] 用来安装指定包的所有系统依赖项

## 2. 一些注意事项
1. 自己添加一个catkin工作空间，my_catkin_ws, 进入其中，执行一下catkin_make, 把生成的 devel/setup.bash 也添加到 ~/.bashrc 中， 这样每次启动terminal就可以使用ros环境及命令找到 my_catkin_ws下的包信息

## 3. ros空间创建

1. 创建一个目录(ros空间) ，这个目录下一定要用一个src目录(代码空间)
```sh
mkdir -p /[dir]/my_catkin_ws/src 
```

2. 空间的初始化工作
```sh
cd  my_catkin_ws
catkin_make
```

3. 目录结构说明
```yaml
my_catkin_ws/
    .catkin_workspace # ros空间说明文件
    src/   # 代码空间目录
        CMakeLists.txt  # toplevel CMake file, provided by catkin
        package_1/
            CMakeLists.txt  # 内部配置了catkin
            package.xml     # 需要和catkin兼容
        ...
        package_n/
            CMakeLists.txt  # 内部配置了catkin
            package.xml     # 需要和catkin兼容
    build/ # 代码构建目录
    devel/ # 一些环境配置，source其中的setup.sh, 会将此工作区覆盖在您的环境之上
```

4. 设置工作区环境
```sh
source devel/setup.sh
printenv|grep ROS 
# ROS_PACKAGE_PATH: /data/robot/my_catkin_ws/src
# ROSLISP_PACKAGE_DIRECTORIES: /data/robot/my_catkin_ws/devel/share/common-lisp
```

## 4. ros文件系统
`roscd` `rosls` and `rospack` 命令工具的使用
1. rospack的使用
```sh
rospack find [package_name]

# /opt/ros/noetic/share/roscpp
rospack find roscpp

```

2. roscd的使用
```sh
roscd <package-or-stack> [/subdir]

# 直接进入 roscpp目录
roscd roscpp
```

3. rosls的使用
```sh
rosls <package-or-stack> [/subdir]

# 扫描roscpp下的所有文件
rosls roscpp
# 扫描roscpp/cmake下的所有文件
rosls roscpp/cmake
```

## 5. 创建一个ros package
1. 在 ros空间下的 执行创建命令,并构建与配置生效
```bash
catkin_create_pkg [package_name] [deps...]

cd my_catkin_ws/src
catkin_create_pkg beginer_tutorials std_msgs rospy roscpp

cd ../
catkin_make
sh devel/setup.bash
```

2. 依赖关系的查看
```bash
# 直接依赖
rospack depends1 beginer_tutorials
# 间接依赖
rospack depends1 rospy
# 循环所有依赖
rospack depends beginer_tutorials
```

3. 在 my_catkin_ws 目录下 执行 `catkin_make`，进行基本构建

## 6. ROS GRAPH
Graph中的对象 node,topic, service, parameter

#### MASTER
Name service for ROS (i.e. helps nodes find each other)

#### rosout
ROS equivalent of stdout/stderr

#### roscore
Master + rosout + parameter server (parameter server will be introduced later)

#### NODE
1. 是一个ros package中的可执行文件 ，使用ROS client lib与其它Nodes通信. 可以订阅和发布topic, 也能提供或使用一个service
2. ros client lib:  rospy[python client lib], roscpp[cpp client lib]
3. `roscore` `rosnode` `rosrun` 工具的使用
```bash
# 启动一个ros核心，master (provides name service for ROS)，
# 并且会自动启动一个 rosout node
roscore
# 运行指定ros package中的node
rosrun [package_name] [node_name] <__name:=node重命名>
rosrun turtlesim turtlesim_node

# 查看当前正在使用的node列表
rosnode list

# 查看指定node的信息
rosnode info rosout

# 指定节点是否在线
rosnode ping rosout

# 清理不存在的node
rosnode cleanup
```
#### TOPIC
1. ROS topics: 可以让多个节点用 发布订阅模式互相发送接收消息，以达到通信的目的
2. `rostopic` 命令及rqt_plot工具的使用
```bash
roscore
# 启动两个node
rosrun turtlesim turtlesim_node
rosrun turtlesim turtle_teleop_key

# 启动rqt_graph 可以绘制node间的通信关系
rosrun rqt_graph rqt_graph 

# rostopic可以控制及展示topic方式
# 展示所有topics
rostopic list -v
# 打印topic的消息
rostopic echo [topic]
# 查看topic type
rostopic type [topic_or_field]
# rostopic中的 type 的明细
rosmsg show [msg_type]

# 发送消息
rostopic pub [option] [topic] [msg_type] [args]

# 可以查看topic按指定频率发送数据时的 实时图表信息流
rosrun rqt_plot rqt_plot
```

#### Service and Parameters
1. service是另一种node间通信方式，允许node发送一个请求或接收一个响应
2. parameters 参数服务，在ROS parameter server上可以存储和操作数据
2. `rosservice`, `rosparam`命令的使用
```bash
# 可以查看node: turtlesim中的 service 信息
rosnode info turtlesim 

# 通过service轻松连接到ROS客户端/服务框架
# 查看在线的所有的service
rosservice list
# 查看在线的服务类型
rosservice type [service_name]

# 查看所有包中的服务
rossrv list
# 查看服务的明细信息
rossrv show [type_name]

# 调用服务
rosservice call [service_name]

# 可以读取、保存、删除数据
# 查看所有数据
rosparam list 
# 数据修改完后，可以使用service来更新变化
rosparam set [param_name] [param_value]
rosparam get [param_name]
# 展示所有数据信息
rosparam get / 

# 将数据保存到文件 
rosparam dump [filename] [namespace]
rosparam load [filename] [namespace]

```

## 7. roslaunch、rosed的使用
```bash
# 用来调度日志的
rosrun rqt_console rqt_console
rosrun rqt_logger_level rqt_logger_level

# roslaunch 可批量启动多个node, 需要配置xx.launch文件
roslaunch [package] [filename.launch]

# rosed 可以用来编辑package中的文件 ，而不用进入包目录下
# The default editor for rosed is vim
# export EDITOR='nano -w' 来修改默认编辑器
rosed [package] [filename]
```

## 8. 创建msg和srv
1. msg: 一个msg文件描述了ros msg的fields, 它们是用来生成消息的源代码， 存放在package下的msg目录下
2. srv: 一个srv文件描述了一个service, 由requeste和response组成， 存放在package下的srv目录下
3. 创建文件后， 需要在package.xml中配置好转换源码, 需要配置CMakeLists.txt
    package.xml:  message_generation[build] message_runtime[exec]
    CMakeLists.txt: message_generation(){}  find_package(message_generation) add_msg add_srv
```plain
msg file 中每行由 field_type + 空格 + field_name组成
field_type 有以下值:
    int8, int16, int32, int64 (plus uint*)
    float32, float64
    string
    time, duration
    other msg files
    variable-length array[] and fixed-length array[C]
    Header: contains a timestamp and coordinate frame information that are commonly used in ROS.
例如：
    Header header
    string child_frame_id
    geometry_msgs/PoseWithCovariance pose

srv file 与 msg file类似，但是有两部分组成， resquest 和 response 使用 "--" 分隔，
例如：
    int64 A
    int64 B
    --
    int64 Sum

```
```bash
# 使用复制
roscp [package] [file] [copy_path]
```

## 9. 编写pub/sub程序、service程序
1. pub sub来了解topic消息传递， 不同node间如何发送/接收消息
2. service 来了解 其它node如何与 这个node的service 交互的
```bash
例子创建了 4个node
1. talker node 通过 chatter topic 发送消息
2. listener node 通过 chatter topic 来获取消息
2. add_two_ints_server node 里创建了一个 add_two_ints service
3. add_two_ints_client node 连接 add_two_ints service, 并调用获取结果
```

## 10. 记录ros支行中的数据，后续可以回溯
1. 使用 `rosbag` 来记录行为，并统计行为信息
```bash
# 操作其它node时 会在当前生成一个bag文件，
rosbag [options] [topic ...]
rosbag record -a
rosbag record ---node [node_name] -e '*cmd_vel' -O [bag_name]/-o [bag_name_prefix]

# 统计bag文件信息
rosbag info [bag_file]

# 重新执行bag中的行为
rosbag play [bag_file]
```
2. 从bag文件中读取消息
```bash
# 可以直接读取到bag中的消息
rostopic echo -b [bag_file] [topic]
```

## 11. roswtf工具的使用
1. 使用`roswtf` 可以检查package相关的问题

## 12. roslaunch细节使用
1. 配置launch文件，来组织多个node的启动