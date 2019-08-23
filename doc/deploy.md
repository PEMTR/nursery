## 部署
> 基础服务群部署，特定于 Ubuntu 18.04.

* 更新源并更新所有依赖.</br>
```sh
apt update && apt full-upgrade -y
```

* 安装基础依赖.</br>
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

* 启用防火墙.</br>
```sh
> ufw allow 22/tcp
> ufw allow 80/tcp
> ufw allow 443/tcp
> ufw enable
```

* 安装docker ce.</br>
```sh
> curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
> add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
> apt update && apt-get install docker-ce docker-ce-cli containerd.io docker-compose
```

* 安装microk8s.</br>
```sh
> snap install microk8s --classic
```

* 拉取项目.</br>
```sh
> cd ~
> mkdir project
> git clone https://gitee.com/guangzhouchenhuiwangluo/nursery
```

* 启动基础服务群.</br>
```sh
> cd ~/project/nursery
> docker-compose up
# 注意：当启动完成之后会阻塞shell
# 这时候要按CTRL+C退出并关闭
# 然后再次启动集群
> docker-compose start
```

* 初始化MongoDB集群.</br>
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

* 配置Kubernetes.</br>
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