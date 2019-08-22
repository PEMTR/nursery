# Nursery
> 小象喝水项目服务端集群


### 版本
(Nightly) </br>
[![pipeline status](http://gitlab.quasipaa.cn/quasipaa/nursery/badges/master/pipeline.svg)](http://gitlab.quasipaa.cn/quasipaa/nursery/commits/master)
[![coverage report](http://gitlab.quasipaa.cn/quasipaa/nursery/badges/master/coverage.svg)](http://gitlab.quasipaa.cn/quasipaa/nursery/commits/master)


### 计划
* [x] Docker compose服务群.<br>
* [x] MongoDB集群.</br>
* [x] MongoDB多文档事务以及驱动的二次封装.</br>
* [x] RabbitMQ驱动二次封装以及增加RPC特性.</br>
* [x] 核心服务事务以及重试机制.</br>
* [ ] 数据库模型设计.</br>
* [x] 核心服务.</br>
* [ ] 接口服务.</br>
* [x] 静态资源服务.</br>
* [ ] 对外代理服务.</br>
* [x] 多媒体处理服务.</br>
* [x] 全文搜索.</br>
* [x] 日志搜集和数据分析.</br>
* [ ] 系统指标.</br>
* [x] 对外接口服务二级缓存.</br>
* [x] 接口文档.</br>
* [ ] 系统文档.</br>
* [x] 项目CI/CD.</br>


### 概述
* 使用`GitLab CI/CD`作为持续集成和测试工具.</br>
* 使用`Docker`作为容器服务和镜像托管.</br>
* `Docker`容器内不包含其他中间件.</br>
* 每个自服务运行独立的`Docker`镜像.</br>
* 该项目包含多个服务，每个服务提供独立运行，不影响其他服务.</br>
* 服务之间通过消息队列传递任务，消息队列驱动增加了RPC特性，可以做到消费回调.</br>
* 数据库为多实例集群，核心交易数据全部依靠多文档事务来处理，并且实现了重试机制，会为指定的事务重试多次，如重试之后依然无法处理，将通过消息队列传递错误.</br>
* 对外接口服务对于接口表单参数或者接口参数都进行了JSON Schema验证，确保避免表单攻击.</br>
* 管理面板接口走`GraphQL`来更好管理数据模板和权限管理.</br>
* 全局状态码保存在`code.json`文件内部，整个系统各服务之间包括对外服务通过规范的状态码沟通.</br>
* 外部服务调用通过`proxy`服务进行代理，区分调试和线上服务，以及保证接口的独立性.</br>
* 外部静态文件统一通过`disk`服务分发和处理.</br>
* 消息队列RPC特性默认全局1分钟的超时，如超过此限制，将关闭当前任务.(此处限制是为了避免异步栈的无限挂起以及内存溢出)</br>
* 项目内部`Express`为定制框架，不同于通用源代码，不能替换为通用`Express`.(`lazy_mod/express` 增加了async error hooks和async return hooks)</br>
* `Elasticsearch` 用来收集服务及系统运行日志和指标，在服务内部使用了bulk写入，以避免管道背压.</br>
* `Node.JS` 的进程管理将由 `Rust` 来实现，包括 `Cluster`, `Rust` 编写的服务启动主进程，并通过 `Uxin Domain Socket` 来传递 `Net` 管道数据, 其他实现包括进程维护和集群控制.</br>


### 源代码管理
* `Master` 为线上分支，不能直接提交，`Dev` 为测试分支，所有提交必须先提交到 `Dev` 分支进行自动测试.</br>
* `Master`为保护分支，不能直接提交到此分支，每个开发者fork自己的分支，不能多用户共用同一分支.</br>
* 每个分支的更新提交`PR`到`Master`分支合并，问题和任务请提交到`Issue`等待开发者处理.</br>
* 文档请查看仓库`Wiki`.</br>


### 环境变量
> 配置文件为TOML格式.
* `NURSERY_CORE_CONFGILE` 核心服务配置文件位置.</br>
* `NURSERY_DISK_CONFFILE` 静态资源服务配置文件位置.</br>
* `NURSERY_INTERFACE_CONFFILE` 接口服务配置文件位置.</br>
* `NURSERY_CACHE_CONFFILE` 缓存服务配置文件位置.</br>
* `NURSERY_DEVICE_CONFFILE` 设备服务配置文件位置.</br>
* `NURSERY_MEDIA_CONFFILE` 多媒体服务配置文件位置.</br>


### 结构
* `analysis` 性能指标及日志类.</br>
* `bin` 动态依赖库.</br>
* `cache` 缓存类.</br>
* `configure` 配置文件.</br>
* `doc` 文档.</br>
* `factory` 工厂类.</br>
* `guard` 独立任务.</br>
* `model` 模型类.</br>
* `router` 路由类.</br>
* `schema` 接口校验类.</br>
* `service` 服务入口.</br>
* `unit_testing` 单元测试.</br>
* `.dockerignore` Docker 忽略规则.</br>
* `.alinode.json` AliNode 性能基线和监控服务配置.</br>
* `.gitlab-ci.yml` GitLab CI/CD 配置.</br>
* `cluster.js` 自封装 Cluster.</br>
* `docker-compose.yml` Docker Compose 服务配置.</br>
* `ecosystem.config.js` PM2 服务配置.</br>
* `code.json` 全局状态码.</br>
* `middleware.js` Express中间件.</br>
* `model.rs` 数据库模型.</br>


### 依赖项
* `GitLab` 项目管理.</br> 
* `Kubernetes` 容器编排.</br>
* `Docker` 镜像容器管理.</br>
* `MongoDB` 业务数据库.</br> 
* `Redis` 缓存.</br>
* `RabbitMQ` 消息队列.</br>
* `Elasticsearch` 全文搜索.</br>
* `FFmpeg` 多媒体处理.</br>


### 来源
- [镜像仓库](https://hub.docker.com/u/quasipaa) 包含服务群所有服务.</br>
- [代码仓库](http://gitlab.quasipaa.cn/quasipaa/nursery) 项目代码管理以及自动集成.</br>


### 开发者
* `Mr.Panda` 主程.</br>


### 部署
> 基础服务群部署，特定于 Ubuntu 18.04.

更新源并更新所有依赖.</br>
```sh
apt update && apt full-upgrade -y
```

安装基础依赖.</br>
```sh
> apt install -y \
    git \
    snap \
    snapd \
    nginx \
    gcc \
    g++ \
    make \
    python \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

启用防火墙.</br>
```sh
> ufw allow 22/tcp
> ufw allow 80/tcp
> ufw allow 443/tcp
> ufw enable
```

安装docker ce.</br>
```sh
> curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
> add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
> apt update && apt-get install docker-ce docker-ce-cli containerd.io docker-compose
```

安装microk8s.</br>
```sh
> snap install microk8s --classic
```

拉取项目.</br>
```sh
> cd ~
> mkdir project
> git clone https://gitee.com/guangzhouchenhuiwangluo/nursery
```

启动基础服务群.</br>
```sh
> cd ~/project/nursery
> docker-compose up
# 注意：当启动完成之后会阻塞shell
# 这时候要按CTRL+C退出并关闭
# 然后再次启动集群
> docker-compose start
```

初始化MongoDB集群.</br>
```sh
> docker-compose exec mongod_rs0 /bin/bash
# 进入mongo shell
> mongo
# 初始化集群
> rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "mongod_rs0:27017" }, { _id: 1, host: "mongod_rs1:27017" }, { _id: 2, host: "mongod_rs2:27017" }] });
# 转到管理库并创建管理员
> use admin
> db.createUser({ user: "<用户名>", pwd: "<密码>", roles:[{ role: "root", db: "admin" }] });
> db.auth("<用户名>", "<密码>");
# 配置集群成员优先级
# 这里让rs0这个节点始终会被选举为主节点
# 避免因为集群节点掉线触发重新选举造成无法连接到主节点的错误
> cfg = rs.conf();
> cfg.members[0].priority = 100;
> cfg.members[0].priority = 0.5;
> cfg.members[0].priority = 0.5;
> rs.reconfig(cfg);
# 这里需要等待一会
# 因为这会触发重新选举
# 请等待一会查看状态查看主节点是否为当前节点
> rs.status();
# 转到业务数据库创建用户
use nursery
> db.createUser({ user: "<用户名>", pwd: "<密码>", roles:[{ role: "dbOwner", db: "nursery" }] });
> db.auth("<用户名>", "<密码>");
# 退出
> exit
> exit
```

配置Kubernetes.</br>
```sh
> microk8s.status --wait-ready
> microk8s.enable dns dashboard
> microk8s.kubectl -n kube-system edit configmap/coredns
# 查看API地址
> microk8s.kubectl cluster-info
# 查看密钥
> microk8s.kubectl -n kube-system get secret
> microk8s.kubectl -n kube-system describe secret default-token-{xxxx}
> ufw allow in on cbr0 && ufw allow out on cbr0
> iptables -P FORWARD ACCEPT
> apt-get install iptables-persistent
> ufw default allow routed
> microk8s.inspect
# 如未显示警告则完成
```