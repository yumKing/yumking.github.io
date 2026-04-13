# springboot 启动流程

[TOC]

## 事件监听器

类: `org.springframework.context.ApplicationListener`



## 初始化器

类: `org.springframework.context.ApplicationContextInitializer`



## 事件广播

类: `org.springframework.boot.context.event.EventPublishingRunListener`

springboot启动时所有监听器的包装



类: `org.springframework.context.event.SimpleApplicationEventMulticaster`

springboot启动时有一个启动广播者，还有一个上下文的广播者



## 资源加载

类: `org.springframework.core.io.support.SpringFactoriesLoader`



## bean工厂



## 前后置处理器



## 一些扩展接口

`Aware`  用来注入指定的类实例， 例：