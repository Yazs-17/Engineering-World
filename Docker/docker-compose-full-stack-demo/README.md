# 介绍docker prod 和 dev的区别

## Prod 网络结构
```bash
浏览器
  |
  | http://your-domain
  |
frontend (nginx)
  |
  | /api → backend:3000
  |
backend（内网）
```
用户永远不知道 backend 存在
非frontend的 curl localhost3000 访问不了后端,
## 启动方式
Dev:
```bash
docker compose -f docker-compose.dev.yml up --build
```
Prod(-d是后台运行，-f是指定文件):
```bash
docker compose -f docker-compose.prod.yml up --build -d
```