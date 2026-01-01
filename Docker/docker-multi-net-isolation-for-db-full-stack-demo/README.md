> 本 demo 默认 prod
> 由于前端采用的是volumn，没用dockerFile，而frontend的nginx中的后端依赖于backend的启动，所以当frontend早于backend启动会报错
> 这里由于演示目的不修改，实际可以把前端volumn改成dockerfile


# 知识点

1. 数据库中的volumn必须用命名volumn，volumn负责数据

2. 命名 volume 的好处（真实工程）

   ```
   volumes:
     pg_data:
   services:
     postgres:
       volumes:
         - pg_data:/var/lib/postgresql/data
   ```

   好处一览：

   | 好处         | 解释                               |
   | ------------ | ---------------------------------- |
   | 生命周期清晰 | 容器删了，数据还在                 |
   | 可复用       | 升级镜像不丢数据                   |
   | 可备份       | `docker run --rm -v pg_data:/data` |
   | 可迁移       | tar / rsync                        |
   | 不怕误删     | `docker compose down` 默认不删     |
   | 非命名volumn | 一堆乱码，不好维护，容易误删       |

3. others

# 正确的网络分层（逻辑模型）
```bash
【公网】
  |
  | 80 / 443
  |
[ Nginx / Frontend ]
  |
  | 内网 HTTP
  |
[ Backend API ]
  |
  | 内网 DB 协议
  |
[ Database ]
```
✔ 前端只知道 /api
✔ 后端连数据库
✔ 数据库不出内网
# 基础命令
启动：
```
docker compose up --build

```

# 实验验证
❌ 前端访问数据库（失败）
```bash
docker compose exec frontend ping db
```
✅ 后端访问数据库
```bash
docker compose exec backend ping db
```
❌ 宿主访问数据库
```bash
psql -h localhost -p 5432
```