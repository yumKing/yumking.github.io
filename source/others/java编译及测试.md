# java编辑及测试

## 清理项目，重新构建
```bash
mvn -pl xxxx-web -am clean compile -P '!consul-dc'
mvn -pl xxxx-web -am compile -P '!consul-dc'
mvn -pl xxxx-job -am compile -P '!consul-dc'
```

## 针对测试类中有main方法需要运行的， 启动时也需要带上 target/test-class
```bash
mvn -pl xxxx-web test-compile -P '!consul-dc'
mvn -pl xxxx-job test-compile -P '!consul-dc'
```

## 如果某个依赖模块有profile 想排除的，则需要先构建
```bash
mvn -pl xxxx-common -am compile -P '!quartz'
mvn -pl xxxx-common  -P '!quartz' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"
```

## 生成classpath 字符串
```bash
mvn -pl xxxx-web  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"
mvn -pl xxxx-job  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"
```

## 测试相关
```bash

# 单元测试不需要接入中间件
# api测试需要接入中间件-所以使用testcontainers来隔离实际中间件
# 单元测试、api测试
mvn -pl xxx-web -am test "-Dsurefire.failIfNoSpecifiedTests=false" "-DfailIfNoTests=false"

# 集成测试使用testcontainers来隔离实际中间件
# 验收测试使用真实中间件
# 集成测试、验收测试
mvn -pl change-robot-web -am failsafe:integration-test failsafe:verify "-Dit.test=UnifiedDataServiceIntegrationTest" "-DfailIfNoTests=false"

```

## 执行调试
```bash
# xxxx-web
$env:HOSTNAME = 'jin' & java "-Dfile.encoding=UTF-8" "-Dspring.quartz.auto-startup=false" -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5045 -cp "xxxx-web/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;xxxx-agent/target/classes;$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication

# xxxx-job
$env:HOSTNAME = 'jin' & java "-Dairobot.devCallbackData=true" "-Dmybatis-plus.configuration.log-impl = org.apache.ibatis.logging.stdout.StdOutImpl"  "-Dfile.encoding=UTF-8" "-Dnwd.job.enabled=false" "-Dspring.quartz.auto-startup=false"   -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5025  -cp "xxxx-job/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;$(cat xxxx-job/classpath.txt)" com.xxxx.XxxxxJobApplication
```bash

## 只运行不调试
```bash
# xxxx-web
$env:HOSTNAME = 'jin' & java "-Dfile.encoding=UTF-8" "-Dspring.quartz.auto-startup=false"   -cp "xxxx-web/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;xxxx-agent/target/classes;$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication

# xxxx-job
$env:HOSTNAME = 'jin' & java "-Dmybatis-plus.configuration.log-impl = org.apache.ibatis.logging.stdout.StdOutImpl" "-Dfile.encoding=UTF-8" "-Dnwd.job.enabled=false" "-Dspring.quartz.auto-startup=false"   -cp "xxxx-job/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;$(cat xxxx-job/classpath.txt)" com.xxxx.XxxxxJobApplication
```

## 只编译一些单一模块的类，加速编译时间
```bash
# xxxx-web
javac -encoding "UTF-8" -cp " \
	xxxx-web/src/main/java; \
	xxxx-dal/target/classes; \
	xxxx-model/target/classes; \
	xxxx-service/target/classes; \
	xxxx-util/target/classes; \
	xxxx-common/target/classes; \
	xxxx-agent/target/classes; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-web/target/classes" xxxx-web/src/main/java/

# xxxx-model
javac -encoding "UTF-8" -cp " \
	xxxx-model/src/main/java; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-web/target/classes" xxxx-model/src/main/java/

# xxxx-service
javac -encoding "UTF-8" -cp " \
	xxxx-dal/target/classes; \
	xxxx-model/target/classes; \
	xxxx-service/target/classes; \
	xxxx-util/target/classes; \
	xxxx-common/target/classes; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-service/target/classes" xxxx-service/src/main/java/
```
---

## 将项目子模块 install到本地仓库
```bash
# 清理项目，重新构建
mvn -pl xxxx-web -am clean install -P '!consul-dc'
mvn -pl xxxx-web -am install -P '!consul-dc'

# 如果某个依赖模块有profile 想排除的，则需要先构建
mvn -pl xxxx-common -am install -P '!quartz'

# 生成classpath 字符串
mvn -pl xxxx-web  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-Dmdep.outputFile=classpath.txt"

# 执行调试
java "-Dspring.quartz.auto-startup=false"   -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5025 -cp "$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication
```

## 一些依赖配置
```xml
<!-- HotSwap -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>


<!-- mvn 增量编译 -->
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-compiler-plugin</artifactId>
	<version>3.11.0</version>
</plugin>
```

---
## pwsh encoding
```bash
chcp 65001 > $null
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "UTF-8 mode enabled. Now run your Java app."
```
