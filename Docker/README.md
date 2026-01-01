## 使用情景与解决方案（Win）



### 1. 配置源

1. Docker Desktop>Settings>Docker Engine

2. ```json
   {
     "registry-mirrors": [
       "https://docker.m.daocloud.io",
       "https://hub-mirror.c.163.com",
       "https://mirror.baidubce.com"
     ]
   }
   ```

3. `docker info` for check

### 2. prod环境中验证后端还活着

1. enter the sh
   ```bash
   docker compose exec frontend sh
   curl http://backend:3000
   ```

2. 日志
   ```bash
   docker compose logs backend
   ```

### 3. 删除当前 compose 项目的所有构建产物

> docker compose build 后会产生（1. 镜像；2. 构建缓存（Layer Cache） 3.  可能有 dangling image）

```bash
docker compose down --rmi all --volumes --remove-orphans
# OR
docker compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
```

###### 会删除：

- ✔ 所有容器
- ✔ 所有 build 出来的镜像
- ✔ 匿名 volume, 不会删named volume
- ✔ 残留容器

### 4. 彻底清空 Docker

```bash
docker system prune -a --volumes
```

会删除：

- 所有未使用镜像
- 所有未运行容器
- 所有未用 volume
- 所有缓存





## 架构学习路线

```yml
单机 Docker Compose
        ↓
多网络 Compose（你现在）
        ↓
Docker Swarm / 单节点 K8s
        ↓
K8s 集群 + Ingress
        ↓
Service Mesh / 云原生
```



