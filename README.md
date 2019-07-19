nursery
> 小象喝水项目服务端


### 版本
Nightly


### 概述
* 使用`Travis CI`作为持续集成和测试工具.</br>
* 使用`Docker`作为容器服务和镜像托管.</br>
* `Docker`容器内不包含其他中间件.</br>


### 源代码管理
* `Master`为保护分支，不能直接提交到此分支.</br>
* 每个开发者fork自己的分支，不用多用户共用同一分支.</br>
* 每个分支的更新提交`PR`到`Master`分支合并.</br>
* `Master`分支代表最终线上环境.</br>


### 结构
* `bin` 动态依赖库.</br>
* `model` 数据库或者缓存模型.</br>
* `router` 路由模块.</br>
* `schema` 接口校验模板.</br>
* `scripts` 自动化脚本(Linux Bash).</br>
* `configure.toml` 配置文件.</br>
* `main.js` 入口文件.</br>


### 依赖项
* `MongoDB` 业务数据库.</br> 
* `Redis` 缓存.</br>
* `RabbitMQ` 消息队列.</br>
* `Elasticsearch` 全文搜索.</br>
* `FFmpeg` 多媒体处理.</br>


### 计划
[] 拆分服务.</br>
[] 全文搜索的接入.</br>
[] 多媒体处理转为Rust Native FFI.</br>