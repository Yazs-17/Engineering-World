# Start
```bash
docker-compose down -v  # 清理旧容器
docker-compose up --build
```
多服务依赖的正确做法：

- 每个服务都配 healthcheck
- 后端用 depends_on + condition: service_healthy 确保依赖服务就绪后才启动

# Other
现在 Docker 层已经配好了。以后只需要：

- 修改 backend/server.js 写业务逻辑
- 如果加新依赖，更新 package.json
- 运行 docker-compose up --build 即可

# 知识点
## docker网络管理铁律
凡是“被后端用的服务”，都只进后端内网
凡是“对用户暴露的入口”，只在前端网

## 服务分区铁律
把所有服务分成 3 类：

| 类别           | 典型例子                | 是否暴露端口 | 放在哪个网                 |
| -------------- | ----------------------- | ------------ | -------------------------- |
| **入口层**     | nginx / api-gateway     | ✅ 是         | frontend-net               |
| **业务层**     | backend / worker        | ❌            | frontend-net + backend-net |
| **基础设施层** | redis / es / mysql / mq | ❌            | backend-net                |

基础设施永远不直接对人

## 其实
真实的项目中，也只有两个网络：
```yaml
networks:
  frontend-net:
  backend-net:
```
后面也只是在backend-net 不断加服务

