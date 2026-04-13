qemu系统模拟 提供了一个虚拟的机器模型，用于运行在客户操作系统。

qemu系统模拟 支持多种虚拟机管理程序(加速器), 支持微型代码生成器(TCG)的JIT，能够模拟多个CPU。

## 加速器有：

	1. KVM， 主机操作系统为Linux (架构可以是:   Arm (64 bit only), MIPS, PPC, RISC-V, s390x, x86)
	1. Hypervisor Framework (hvf) , 主机操作系统为MacOS ( 架构可以是: x86 (64 bit only), Arm (64 bit only) )
	1. Windows Hypervisor Platform (whpx), 主机操作系统为 Windows ( 架构可以是: x86 )
	1. NetBSD Virtual Machine Monitor (nvmm)， 主机操作系统为 NetBSD( 架构可以是: x86 )
	1. Tiny Code Generator (tcg)， 主机操作系统为 Linux, other POSIX, Windows, MacOS( 架构可以是: Arm, x86, Loongarch64, MIPS, PPC, s390x, Sparc64)

```bash
qemu-system-arm -machine [machine opts] \  		# 定义机器类型、内存量等
                -cpu [cpu opts] \			# vCPU 的类型和数量/拓扑。大多数加速器都提供hostCPU 选项，该选项会直接传递主机 CPU 配置，而不会过滤任何功能。
                -accel [accelerator opts] \	# 这取决于您运行的虚拟机管理程序。请注意，默认设置是 TCG，它是纯模拟的，因此您必须指定加速器类型才能利用硬件虚拟化。
                -device [device opts] \			# 机器类型中默认未定义的附加设备。
                [backend opts] \		# 后端是 QEMU 处理客户机数据的方式，例如块设备如何存储、网络设备如何查看网络或串行设备如何指向外部世界。
                [interface opts] \		# 系统如何显示，如何管理和控制或调试。
                [boot opts]				# 系统如何启动，通过固件还是直接内核启动
                
# 支持的机器
qemu-system-arm -M help 

# 支持的设置
qemu-system-arm -device help

# 支持的设置 scsi-hd中的参数查询
qemu-system-x86_64 -device scsi-hd,help


```



## QEMU 支持模拟大量设备，从网卡、USB 等外围设备到集成片上系统 (SoC)

1. 设备前端， 设备呈现给客户机的方式，呈现的设备类型应与客户机操作系统期望看到的硬件相匹配，使用 `--device`命令行选项指定

2. 设备总线，大多数设备都会存在于某种总线上

3. 设备后端，后端描述了 QEMU 将如何处理来自模拟设备的数据

4. 设备直通



## qemu架构

```bash
	Apps			|	Apps ...		
--------------------|-------------------
客户机系统(Guest)	 |客户机系统(Guest)...	  |-----------------
--------------------|-------------------	 |----QEMU模块-----|
Qemu(x86架构)	       | Qemu(ARM架构)...   --> |   CPU模拟		  |
----------------------------------------	 |    内存模拟	    |
		宿主系统(host, linux)		 		  |    I/O设备模拟	 |
----------------------------------------	 |   其它设备模拟	  |
		硬件平台(如x86架构)
----------------------------------------
```

从本质上看，虚拟出的每个虚拟机对应 host 上的一个 Qemu 进程，而虚拟机的执行线程（如 CPU 线程、I/O 线程等）对应 Qemu 进程的一个线程。

## 下面通过一个虚拟机启动过程看看 Qemu 是如何与 KVM 交互的:

```c
// 第一步，获取到 KVM 句柄
kvmfd = open("/dev/kvm", O_RDWR);
// 第二步，创建虚拟机，获取到虚拟机句柄。
vmfd = ioctl(kvmfd, KVM_CREATE_VM, 0);
// 第三步，为虚拟机映射内存，还有其他的 PCI，信号处理的初始化。ioctl(kvmfd, KVM_SET_USER_MEMORY_REGION, &mem);
// 第四步，将虚拟机镜像映射到内存，相当于物理机的 boot 过程，把镜像映射到内存。
// 第五步，创建 vCPU，并为 vCPU 分配内存空间。
ioctl(kvmfd, KVM_CREATE_VCPU, vcpuid);
vcpu->kvm_run_mmap_size = ioctl(kvm->dev_fd, KVM_GET_VCPU_MMAP_SIZE, 0);
// 第五步，创建 vCPU 个数的线程并运行虚拟机。ioctl(kvm->vcpus->vcpu_fd, KVM_RUN, 0);
// 第六步，线程进入循环，并捕获虚拟机退出原因，做相应的处理。
for (;;) {    
    ioctl(KVM_RUN);
    switch (exit_reason) {          
        case KVM_EXIT_IO:  /* ... */          
        case KVM_EXIT_HLT: /* ... */    
    }
}
// 这里的退出并不一定是虚拟机关机，
// 虚拟机如果遇到 I/O 操作，访问硬件设备，缺页中断等都会退出执行，
// 退出执行可以理解为将 CPU 执行上下文返回到 Qemu。
```



## qemu源码结构：

Qemu 软件虚拟化实现的思路是采用二进制指令翻译技术，主要是提取 guest 代码，然后将其翻译成 TCG 中间代码，最后再将中间代码翻译成 host 指定架构的代码，如 x86 体系就翻译成其支持的代码形式，ARM 架构同理。

```bash
/vl.c：最主要的模拟循环，虚拟机环境初始化，和 CPU 的执行。
/target/arch/tcg/translate.c：将 guest 代码翻译成不同架构的 TCG 操作码。
/tcg/tcg.c：主要的 TCG 代码。
/tcg/arch/tcg-target.c：将 TCG 代码转化生成主机代码。
/cpu-exec.c：主要寻找下一个二进制翻译代码块，如果没有找到就请求得到下一个代码块，并且操作生成的代码块。
```

总体流程：

命令行参数 --> 初始化机器--> 创建设备 --> 初始化CPU -> 加载内核 

​	|												|

​	V												V

   内存/设备配置   <--   事件循环   -->   执行翻译块     -->      处理中断

```bash
1、初始化阶段
	1、解析命令行参数， 参数决定了模拟的硬件配置（如 开发板型号、cpu类型、内存大小等）
	2、创建虚拟机器， -M, 调用machine_init(),初始化该机器的硬件配置
	3、初始化虚拟设备， 根据机器模型注册虚拟设备，设备初始化包括 内存映射、中断请求线分配、设备状态初始化
2、CPU模拟内核
	1、初始化CPU，创建虚拟cpu，初始化寄存器状态
	2、翻译块（TB）生成与执行，将客户机的指令翻译为宿主机的中间代码(TCG IR)并优化，并生成原生代码缓存起来
3、内存模拟
	1、虚拟内存布局， ram区域(-m指定)、rom(如加载固件)、设备寄存器(MMIO)
	2、内存访问处理, 检测地址是否命中RAM/ROM/MMIO, 对RAM/ROM直接读写宿主内存、对MMIO触发设备回调函数
4、外设模拟
5、启动客户机操作系统
6、事件循环与退出
	1、主循环， cpu执行、设备io事件、异步任务
	2、退出条件，客户机执行关机指令、用户强制终止
```





```bash


main.c
	1.qemu_init
	2.qemu_main -> qemu_main_loop, qemu_cleanup
 
qemu_init
	1.qemu基本配置
	2.module_call_init(MODULE_INIT_OPTS)
	#3.error_init
	#4.qemu_init_exec_dir
	#5.os_setup_limits
	#6.qemu_init_arch_modules
	7.qemu_init_subsystems
		0.module_call_init(MODULE_INIT_TRACE)
        1.qemu_init_cpu_list # cpu锁初始化
        2.qemu_init_cpu_loop # 初始化信号总线，和锁
        3.qemu_run_exit_notifiers #退出hook
        4.module_call_init(MODULE_INIT_QOM) ###关键###
        5.module_call_init(MODULE_INIT_MIGRATION)
        #6.runstate_init
        #7.precopy_infrastructure_init  通知相关
        #8.postcopy_infrastructure_init  通知相关
        9.monitor_init_globals
        #10.bdrv_init_with_whitelist
	8.根据入参配置qemu # 参数说明在 qemu-options.hx文件中，构建后会生成qemu-options.def文件
	9.qemu_init_main_loop
	10.cpu_timers_init  ###关键###
	11.configure_rtc
	12.parse_memory_options
	13.qemu_create_machine ###关键, 这里实现对象的创建###
	#suspend_mux_open
	14.qemu_setup_display
	15.qemu_create_default_devices
	16.qemu_create_early_backends
	17.configure_accelerators ###关键###
	18.qemu_create_late_backends
	19.migration_object_init
	20.qemu_resolve_machine_memdev ###关键###
	21.qemu_init_displays
	#resume_mux_open

	
```





 主要模拟点有：

##### CPU虚拟化:  arm cpu实现分析，arm soc建立，一些寄存器实现添加，TCG原理，指令添加

```bash
TYPE_CPU
所有 CPU 类的基类，定义在 hw/core/cpu-common.c 中。
提供通用 CPU 功能，如寄存器、内存管理、中断处理等

TYPE_ARM_CPU
继承自 TYPE_CPU，定义在 target/arm/cpu.c 中。
提供 ARM 架构通用功能，如：
ARM 寄存器（R0-R15、CPSR、SPSR）。
ARM 指令集（ARM、Thumb、Thumb2）。
ARM 异常模型（IRQ、FIQ、Abort、Undef）。
ARM 内存管理（MMU、TLB、页表）。

TYPE_ARM_V7M_CPU
继承自 TYPE_ARM_CPU，定义在 target/arm/tcg/cpu-v7m.c 中。
模拟 ARMv7-M 架构（Cortex-M3/M4/M7）。
支持 Thumb-2 指令集、NVIC、MPU。


TYPE_CPU
    |
    +-- TYPE_ARM_CPU
        |
        +-- TYPE_ARM_V7M_CPU
        |   |
        |   +-- TYPE_ARM_CORTEX_M3_CPU
        |   +-- TYPE_ARM_CORTEX_M4_CPU
        |   +-- TYPE_ARM_CORTEX_M7_CPU
        |
        +-- TYPE_ARM_V7A_CPU
        |   |
        |   +-- TYPE_ARM_CORTEX_A7_CPU
        |   +-- TYPE_ARM_CORTEX_A8_CPU
        |   +-- TYPE_ARM_CORTEX_A9_CPU
        |   +-- TYPE_ARM_CORTEX_A15_CPU
        |   +-- TYPE_ARM_CORTEX_R5_CPU
        |
        +-- TYPE_ARM_V8A_CPU
        |   |
        |   +-- TYPE_ARM_CORTEX_A53_CPU
        |   +-- TYPE_ARM_CORTEX_A57_CPU
        |   +-- TYPE_ARM_CORTEX_A72_CPU
        |   +-- TYPE_ARM_CORTEX_A73_CPU
        |   +-- TYPE_ARM_CORTEX_A75_CPU
        |   +-- TYPE_ARM_CORTEX_A76_CPU
        |
        +-- TYPE_ARM_V8R_CPU
            |
            +-- TYPE_ARM_CORTEX_R52_CPU
```



##### 中断虚拟化: qemu irq机制

```bash

TYPE_SYS_BUS_DEVICE
    |
    +-- TYPE_ARM_GIC_COMMON
    |   |
    |   +-- TYPE_ARM_GIC
    |   |   |
    |   |   +-- TYPE_ARM_GIC_KVM
    |   |
    |   +-- TYPE_ARM_GICV3_COMMON
    |       |
    |       +-- TYPE_ARM_GICV3
    |           |
    |           +-- TYPE_ARM_GICV3_KVM
    |
    +-- TYPE_ARM_GICV3_ITS
    |   |
    |   +-- TYPE_ARM_GICV3_ITS_KVM
    |
    +-- TYPE_ARM_V7M_NVIC
```



##### 内存虚拟化: qemu内存原理， 用户态/系统态程序加载运行方式

```bash

```

##### 总线虚拟化: qemu总线原理

##### 外设虚拟化: uart、gpio实现与应用

```bas
TYPE_ARM_TIMER
继承自 TYPE_SYS_BUS_DEVICE，定义在 hw/timer/arm_timer.c 中。
模拟 ARM 通用定时器，支持：
定时器计数。
定时器中断。
定时器控制。

TYPE_ARM_GTIMER
继承自 TYPE_SYS_BUS_DEVICE，定义在 hw/timer/arm_gtimer.c 中。
模拟 ARM 通用定时器，支持：
定时器计数。
定时器中断。
定时器控制

TYPE_SYS_BUS_DEVICE
    |
    +-- TYPE_ARM_SYSCTL
    |
    +-- TYPE_ARM_SMMU
    |   |
    |   +-- TYPE_ARM_SMMUV3
    |
    +-- TYPE_ARM_TIMER
    |
    +-- TYPE_ARM_MPTIMER
    |
    +-- TYPE_ARM_GTIMER
    |
    +-- TYPE_ARM_PL011
    |
    +-- TYPE_ARM_PL031
    |
    +-- TYPE_ARM_NETWORK
    |
    +-- TYPE_ARM_SD
    |
    +-- TYPE_ARM_EMMC
    |
    +-- TYPE_ARM_FRAMEBUFFER
    |
    +-- TYPE_ARM_AUDIO
    
    
TYPE_ARM_SYSCTL 提供：
系统配置寄存器。
系统状态寄存器。
系统控制寄存器。
TYPE_ARM_SMMU 提供：
内存地址转换。
内存访问权限控制。
内存缓存控制。
TYPE_ARM_SMMUV3 提供：
内存地址转换。
内存访问权限控制。
内存缓存控制。
支持 Stage 1 和 Stage 2 转换。
TYPE_ARM_TIMER 提供：
定时器计数。
定时器中断。
定时器控制。
TYPE_ARM_MPTIMER 提供：
多核定时器计数。
多核定时器中断。
多核定时器控制。
TYPE_ARM_GTIMER 提供：
定时器计数。
定时器中断。
定时器控制。
TYPE_ARM_PL011 提供：
串口通信。
串口中断。
串口控制。
TYPE_ARM_PL031 提供：
实时时钟。
闹钟功能。
RTC 中断。
TYPE_ARM_NETWORK 提供：
网络通信。
网络中断。
网络控制。
TYPE_ARM_SD 提供：
SD 卡读写。
SD 卡中断。
SD 卡控制。
TYPE_ARM_EMMC 提供：
eMMC 读写。
eMMC 中断。
eMMC 控制。
TYPE_ARM_FRAMEBUFFER 提供：
显示输出。
显示中断。
显示控制。
TYPE_ARM_AUDIO 提供：
音频输出。
音频中断。
音频控制。
```



##### Machine虚拟化： qemu整体运行流程分析，MCU/LINUX 设备组织方式

```bash
TYPE_MACHINE
    |
    +-- TYPE_ARM_MACHINE
        |
        +-- TYPE_VIRT_MACHINE
        +-- TYPE_VEXPRESS_MACHINE
        +-- TYPE_HIGHBANK_MACHINE
        +-- TYPE_MPS2_MACHINE
        +-- TYPE_MUSCA_MACHINE
        +-- TYPE_MUSICPAL_MACHINE
        +-- TYPE_NETDUINO2_MACHINE
        +-- TYPE_NSERIES_MACHINE
        +-- TYPE_OMAP_SX1_MACHINE
        +-- TYPE_PALM_MACHINE
        +-- TYPE_REALVIEW_MACHINE
        +-- TYPE_SABRELITE_MACHINE
        +-- TYPE_SBSA_REF_MACHINE
        +-- TYPE_STELLARIS_MACHINE
        +-- TYPE_STM32VLDISCOVERY_MACHINE
        +-- TYPE_STRONGARM_MACHINE
        +-- TYPE_COLLIE_MACHINE
        +-- TYPE_GUMSTIX_MACHINE
        +-- TYPE_SPITZ_MACHINE
        +-- TYPE_TERRIER_MACHINE
        +-- TYPE_TOSA_MACHINE
        +-- TYPE_Z2_MACHINE
```





QEMU中的一些机制：

QOM(qemu object model): 一个面向对象的C框架， 主要用来注册用户创建的类型与初始化这些类型

说明：

```bash
type_init 将各种类型注册到模块中的初始化数组中(这个注册过程在执行模拟前会运行，因为 __attribute__((constructor)) 修饰，不用手动调用函数 )

在执行模拟时，会调用模块初始化过程， 执行object.c中的type_register_static函数，初始化类型实现TypeImpl, 并放入object.c中的 hashTable中
```

1. type_init

   ```bash
   type_init(function) 宏展开是下面的格式
   static void __attribute__((constructor)) do_qemu_init_ ## function(void)
   {                                                                           
       register_module_init(function, MODULE_INIT_QOM);                                 
   }
   ```

2. DEFINE_MACHINE

3. DEFINE_TYPES

4. 类层次结构梳理

   ```bash
   所有对象类的父类是 ObjectClass
   所有对象的父类是 Object
   所有类型的实现使用 TypeImpl --> 并放入对象类中
   ```

   
