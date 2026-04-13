#### 日志查询
```bash
find /logs/ -name "*.out" -type f -newermt '2025-06-26 18:30:00' ! -newermt '2025-06-27 00:00:00' -exec ls -al {} \;
find /logs -name "*.out" -type f -newermt '2025-06-26 18:30:00' ! -newermt '2025-06-27 00:00:00' -exec ls -al {} \; |awk '{print $9}' |xargs grep -r "xxx"
```

#### kubectl命令

```bash
kubectl get pod -n mm

kubectl exec -it -n mm [容器id] /bin/bash

kubectl describe pod [podName] -n mm

# 查看集群信息
kubectl cluster-info

# 查看nodes信息
kubectl get node -o wide
kubectl describe node <node-name>
kubectl top node <node-name>
kubectl get node [node-name] --show-labels

kubectl top pods |grep dd
kubectl get pod xxx -o custom-columns=NAME:.metadata.name,MEM_REQ:.spec.containers[0].resources.requests.memory,MEM_LIM:.spec.containers[0].resources.limits.memory


设置单个或多个标签
kubectl label node <node-name> label-name=label-val [...]
# 修改标签
kubectl label node <node-name> label-name=label-val --overwrite=true
# 删除标签
kubectl label node <node-name> <label-name>-
# 根据标签筛选
kubectl get node -L <label-name>
kubectl get node -l "labe-name in (label-val1, label-val2...)" 

kubectl edit deployment <deployment-name>

# pod扩容, 使用current-replicas 来控制范围，防止弄错
kubectl scale --current-replicas=[query_current_replicas] --replicas=[num] deployment [deployment-name]

# 重启deployment
kubectl rollout restart deployment [deploymentName] -n [namespace]
```


#### linux常用操作

```bash
# 查看指定用户的进程
ps -fu <username>

# 查看应用的tcp端口
netstat -tlnp

# 去掉不要的内容
grep -v "grep"

#tar 打包排除 tar version: 1.30及以上
 tar -cf xxx.tar --exclude=xxx/dist --exclude=xxx/node_modules xxx
 
 # 文件大小排序
 ls -Slh| grep "xx_2025"|grep MYI|head|awk '{print $5, $9}'
```