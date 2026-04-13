1、清理项目，重新构建
mvn -pl xxxx-web -am clean compile -P '!consul-dc'
mvn -pl xxxx-web -am compile -P '!consul-dc'
mvn -pl xxxx-job -am compile -P '!consul-dc'

## 针对测试类中有main方法需要运行的， 启动时也需要带上 target/test-class
mvn -pl xxxx-web test-compile -P '!consul-dc'
mvn -pl xxxx-job test-compile -P '!consul-dc'

2、如果某个依赖模块有profile 想排除的，则需要先构建
mvn -pl xxxx-common -am compile -P '!quartz'
mvn -pl xxxx-common  -P '!quartz' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"

3、生成classpath 字符串
mvn -pl xxxx-web  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"
mvn -pl xxxx-job  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-DexcludeGroupIds=com.xxxx" "-Dmdep.outputFile=classpath.txt"

4、执行调试
-- xxxx-web
$env:HOSTNAME = 'jin' & java "-Dfile.encoding=UTF-8" "-Dspring.quartz.auto-startup=false" -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5045 -cp "xxxx-web/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;xxxx-agent/target/classes;$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication

-- xxxx-job
$env:HOSTNAME = 'jin' & java "-Dairobot.devCallbackData=true" "-Dmybatis-plus.configuration.log-impl = org.apache.ibatis.logging.stdout.StdOutImpl"  "-Dfile.encoding=UTF-8" "-Dnwd.job.enabled=false" "-Dspring.quartz.auto-startup=false"   -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5025  -cp "xxxx-job/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;$(cat xxxx-job/classpath.txt)" com.xxxx.XxxxxJobApplication

5、只运行不调试
-- xxxx-web
$env:HOSTNAME = 'jin' & java "-Dfile.encoding=UTF-8" "-Dspring.quartz.auto-startup=false"   -cp "xxxx-web/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;xxxx-agent/target/classes;$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication

-- xxxx-job
$env:HOSTNAME = 'jin' & java "-Dmybatis-plus.configuration.log-impl = org.apache.ibatis.logging.stdout.StdOutImpl" "-Dfile.encoding=UTF-8" "-Dnwd.job.enabled=false" "-Dspring.quartz.auto-startup=false"   -cp "xxxx-job/target/classes;xxxx-dal/target/classes;xxxx-model/target/classes;xxxx-service/target/classes;xxxx-util/target/classes;xxxx-common/target/classes;$(cat xxxx-job/classpath.txt)" com.xxxx.XxxxxJobApplication


6、只编译一些单一模块的类，加速编译时间
--xxxx-web
javac -encoding "UTF-8" -cp " \
	xxxx-web/src/main/java; \
	xxxx-dal/target/classes; \
	xxxx-model/target/classes; \
	xxxx-service/target/classes; \
	xxxx-util/target/classes; \
	xxxx-common/target/classes; \
	xxxx-agent/target/classes; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-web/target/classes" xxxx-web/src/main/java/

-- xxxx-model
javac -encoding "UTF-8" -cp " \
	xxxx-model/src/main/java; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-web/target/classes" xxxx-model/src/main/java/

-- xxxx-service
javac -encoding "UTF-8" -cp " \
	xxxx-dal/target/classes; \
	xxxx-model/target/classes; \
	xxxx-service/target/classes; \
	xxxx-util/target/classes; \
	xxxx-common/target/classes; \
	$(cat xxxx-web/classpath.txt)" -d "xxxx-service/target/classes" xxxx-service/src/main/java/

============================
将项目子模块 install到本地仓库
1、清理项目，重新构建
mvn -pl xxxx-web -am clean install -P '!consul-dc'
mvn -pl xxxx-web -am install -P '!consul-dc'

2、如果某个依赖模块有profile 想排除的，则需要先构建
mvn -pl xxxx-common -am install -P '!quartz'

3、生成classpath 字符串
mvn -pl xxxx-web  -P '!consul-dc' -q dependency:build-classpath "-Dscope=runtime" "-Dmdep.outputFile=classpath.txt"

4、执行调试
java "-Dspring.quartz.auto-startup=false"   -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5025 -cp "$(cat xxxx-web/classpath.txt)" com.xxxx.XxxxxWebApplication


-- HotSwap
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>


--mvn 增量编译
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-compiler-plugin</artifactId>
	<version>3.11.0</version>
</plugin>

==========================================
chcp 65001 > $null
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Write-Host "UTF-8 mode enabled. Now run your Java app."

==========================================