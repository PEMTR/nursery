# Nursery
> 小象喝水项目服务端集群


### 版本
Nightly


### 计划
* [x] Docker compose服务群.<br>
* [x] MongoDB集群.</br>
* [x] MongoDB多文档事务以及驱动的二次封装.</br>
* [x] RabbitMQ驱动二次封装以及增加RPC特性.</br>
* [x] 核心服务事务以及重试机制.</br>
* [ ] 数据库模型设计.</br>
* [ ] 终端服务.</br>
* [ ] 核心服务.</br>
* [ ] 接口服务.</br>
* [x] 静态资源服务.</br>
* [ ] 对外代理服务.</br>
* [x] 多媒体处理服务.</br>
* [x] 全文搜索.</br>
* [x] 日志搜集和数据分析.</br>
* [ ] 系统指标.</br>
* [ ] 项目CI/CD.</br>
* [x] 对外接口服务二级缓存.</br>
* [x] 接口文档.</br>
* [ ] 系统文档.</br>


### 概述
* 使用`Travis CI`作为持续集成和测试工具.</br>
* 使用`Docker`作为容器服务和镜像托管.</br>
* `Docker`容器内不包含其他中间件.</br>
* 每个自服务运行独立的`Docker`镜像.</br>


### 细节
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
* `Master`为保护分支，不能直接提交到此分支.</br>
* 每个开发者fork自己的分支，不能多用户共用同一分支.</br>
* 每个分支的更新提交`PR`到`Master`分支合并.</br>
* `Master`分支代表最终线上环境.</br>
* 问题和任务请提交到`Issue`等待开发者处理.</br>
* 文档请查看仓库`Wiki`.</br>


### 环境变量
> 配置文件为TOML格式.
* `NURSERY_CORE_CONFGILE` 核心服务配置文件位置.</br>
* `NURSERY_DISK_CONFFILE` 静态资源服务配置文件位置.</br>
* `NURSERY_INTERFACE_CONFFILE` 接口服务配置文件位置.</br>


### 结构
* `bin` 动态依赖库.</br>
* `configure` 配置文件.</br>
* `factory` 工厂类.</br>
* `model` 模型类.</br>
* `router` 路由类.</br>
* `schema` 接口校验类.</br>
* `service` 服务入口.</br>
* `code.json` 全局状态码.</br>
* `middleware.js` Express中间件.</br>


### 依赖项
* `Docker` 镜像容器管理.</br>
* `MongoDB` 业务数据库.</br> 
* `Redis` 缓存.</br>
* `RabbitMQ` 消息队列.</br>
* `Elasticsearch` 全文搜索.</br>
* `FFmpeg` 多媒体处理.</br>


### 来源
- [镜像仓库](https://hub.docker.com/u/quasipaa) 包含服务群所有服务.</br>


### 开发者
* `Mr.Panda` 主程.</br>