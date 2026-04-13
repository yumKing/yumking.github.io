---
name: tech-design
description: 公司级工程骨架生成，这个技能在新项目中使用
alwaysApply: false
---

## 使用当前技能的场景
- 公司创建新项目骨架时
- 指定项目名，且需要创建项目时

**不使用当前技能的场景**
- 除了[使用当前技能的场景]以外的任何场景，用户没有确切说明，都不使用

## 公司级技术栈
1. 编程语言: jdk8
2. web框架: springboot 2.7.18
3. 消息队列: kafka
4. 缓存服务: redis
5. 数据库: postgresql 11
6. 配置管理: apollo
7. 数据库操作: mybatis-plus
8. api校验注解: @validated, @valid

## 工具
1. idea IDE 编码工具
2. apifox api测试工具
3. maven3.9 java打包工具

## maven 公司级基础依赖
### 顶级parent pom 及springboot版本管理
```xml
<parent>
    <groupId>${COMPANY_PARENT_GROUP_ID}</groupId>
    <artifactId>${COMPANY_PARENT_ARTIFACT_ID}</artifactId>
    <version>1.1.0</version>
</parent>

<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <spring-boot.version>2.7.18</spring-boot.version>
    <spring-cloud.version>2021.0.9</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <!-- Spring Boot BOM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- Spring Cloud BOM (自动管理 Netflix 版本) -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

```
### 公司级依赖jar
```xml

```
### springboot依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```
### 编码、文档工具的依赖
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.32</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.4.2.Final</version>
</dependency>
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.26</version>
</dependency>
 <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>4.0.3</version>
</dependency>
 <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.83</version>
</dependency>
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
    <version>4.5.0</version>
</dependency>
```
### 测试工具依赖
```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.18.3</version>
    <scope>test</scope>
    <exclusions>
        <!-- 排除默认 docker-java，使用兼容 Java 8 的版本 -->
        <exclusion>
            <groupId>com.github.docker-java</groupId>
            <artifactId>docker-java-api</artifactId>
        </exclusion>
        <exclusion>
            <groupId>com.github.docker-java</groupId>
            <artifactId>docker-java-transport-httpclient5</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 显式指定 Java 8 兼容的 docker-java -->
<dependency>
    <groupId>com.github.docker-java</groupId>
    <artifactId>docker-java-api</artifactId>
    <version>3.3.3</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>com.github.docker-java</groupId>
    <artifactId>docker-java-transport-httpclient5</artifactId>
    <version>3.3.3</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.18.3</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.18.3</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.3.2</version>
    <scope>test</scope>
</dependency>
<!-- 如果需要 Spring MockMvc 集成 -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>spring-mock-mvc</artifactId>
    <version>5.3.2</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-java</artifactId>
    <version>7.13.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-junit-platform-engine</artifactId>
    <version>7.13.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-spring</artifactId>
    <version>7.13.0</version>
    <scope>test</scope>
</dependency>
```

## 项目结构
- [项目名]-web web应用模块(暴露接口供前端页面调用)
- [项目名]-service 业务逻辑代码模块
- [项目名]-dal mybatis操作模块（数据库操作模块）
- [项目名]-model 实体类模块
- [项目名]-common 公共代码模块

## 源码结构
- src/main/java (代码)
- src/main/java/com (核心代码)
  - /config 配置类
  - /constant 常量类
  - /exception、except 异常类
  - /mapper mybatis接口
  - /job 定时任务类
  - /api 接口包
  - /model 实体类
  - /controller 控制器
  - /service 业务逻辑层
  - /base 基础CRUD逻辑层
  - /enums 全局通用的枚举
  - /util 工具类
  - /dto 逻辑操作的参数
  - /vo/req 前端请求接口的参数
  - /vo/res 响应给前端的参数
- src/test/java (单元测试)
  - acceptance 验收测试
  - api controller层 api测试
  - integraion 集成测试
  - unit 单元测试

## 代码风格
项目使用mvc模式来组织代码,
### 控制器层风格
使用 RESTful 风格的API
```java
package com.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@Api(tags = "xxxController")
@RequestMapping("/xxx")
public class xxxController {
}
```
### 业务服务层风格
```java
package com.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service("xxxService")
public class XxxService extends ServiceImpl<XxxMapper, Xxx> {
}
```
### 数据库访问层风格
```java
package com.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

public interface XxxMapper extends BaseMapper<Xxx>{
}

```

## 注意事项
### Cucumber 与 Spring 的集成
在 Spring Boot 2.7 + Cucumber 7 中，必须在 Step Definition 类上添加 @CucumberContextConfiguration 和 @SpringBootTest，否则 Spring 上下文无法加载。
```java
@CucumberContextConfiguration
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CucumberSpringConfiguration {
    // 此类不需要代码，仅用于引导 Spring 上下文
}
```
### Testcontainers 与 JUnit 5
确保测试类实现了 Testcontainers 接口或使用 @Testcontainers 注解，以便容器生命周期与测试绑定。
```java
@Testcontainers
@SpringBootTest
public class MyIntegrationTest {
    static {
        // Java 8 环境下显式配置 Docker 连接
        // System.setProperty("docker.host", "unix:///var/run/docker.sock");
        // Windows: 
        System.setProperty("docker.host", "npipe:////./pipe/docker_engine");
    }

    @Container
    static PostgresqlContainer<?> pg = new PostgresqlContainer<>("postgresql:11");
    
    // 使用 dynamic properties 将容器 URL 注入 Spring
    @DynamicPropertySource
    static void pgsqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", pg::getJdbcUrl);
    }
}
```
### REST Assured 与 Spring Port
如果使用 WebEnvironment.RANDOM_PORT，需要通过 @LocalServerPort 获取端口并配置 REST Assured。
```java
@LocalServerPort
private int port;

@BeforeEach
public void setup() {
    RestAssured.baseURI = "http://localhost";
    RestAssured.port = port;
}
```


### 实施过程
1.根据上述要求生成项目骨架
2.生成一个简单的User实例的 三层类的实现
3.生成 User的各项测试

