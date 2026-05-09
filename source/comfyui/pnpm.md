# pnpm学习

## workspace的使用
pnpm-workspace.yaml文件解读

## catalog使用

## package.json中的依赖配置
使用 `catalog:[default/指定说明]` 或 `workspace:*` 来引用依赖版本

## 命令的使用
```bash
# 只构建 @my/web 及其依赖的包
pnpm --filter @my/web... run build

# 并行启动所有含 dev 脚本的项目
pnpm -r --parallel --if-present run dev

# 在 utils 包中执行测试
pnpm --filter @my/utils test
```

## react脚手架
```bash

mkdir monorepo-root
cd monorepo-root
# gen root package.json
pnpm init 
mkdir apps packages
touch pnpm-workspace.yaml

cd apps
pnpm create vite@latest my-app -- --template react-ts

# 会自动在 当前子项目下创建一个依赖包，版本号为 catalog:
# 并且会在项目根下的pnpm-workspace.yaml中 catalog 栏目下添加公共的这个包及版本号
pnpm add xxx-pack@ver 

# 子项目依赖另一个子项目，添加依赖
pnpm add moduleB@workspace:* -F modoleA
```

简单编写 `pnpm-workspace.yaml`
```yaml
packages:
  - apps/**
  - packages/**

catalogMode: prefer
cleanupUnusedCatalogs: true
```