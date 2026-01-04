# 前瞻知识
.dockerignore 文件只影响`docker compose build`的时候
**构建时流程**
```bash
本地项目目录
   ↓（先打包）
Build Context（构建上下文）
   ↓
Docker daemon
   ↓
Dockerfile 执行
```
即 .dockerignore 决定：哪些文件“不会进入 Build Context”

> **举例讲解**
> 在构建 Docker 镜像时，常见会使用 COPY . /app 将当前目录复制进镜像。
> 如果没有配置 .dockerignore，Docker 会将宿主机项目目录中除源码外的内容（如 .git、node_modules、日志文件等）一并打包进构建上下文。
> 这会导致：
> 1. COPY 指令涉及的文件范围过大，只要宿主机中任意无关文件发生变化，Docker 缓存就会失效，导致后续层全部重新构建
> 2. 构建上下文体积增大，构建速度变慢，镜像体积膨胀，甚至存在将敏感文件打入镜像的风险