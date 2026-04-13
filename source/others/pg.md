1、初始化
initdb.exe -D D:\local\state\pgdata11 --auth=trust

2、启动服务端
pg_ctl -D "D:\local\state\pgdata11" -l "D:\local\state\pgdata11\logfile" start

注: postgresql.conf 修改端口

3、启动客户端
3.1 先创建数据库(以template1 作为连接点)
psql -U $env:USERNAME -p 10432 -d template1 -c "CREATE DATABASE xxx;"
3、2 使用自己的数据库连接
psql -U $env:USERNAME -h 127.0.0.1 -p 10432 -d ce_robot
