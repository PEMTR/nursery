# Nursery
> XiaoXiang drinking water service server cluster.


### Version
(Nightly) </br>
[![pipeline status](http://gitlab.quasipaa.cn/quasipaa/nursery/badges/master/pipeline.svg)](http://gitlab.quasipaa.cn/quasipaa/nursery/commits/master)
[![coverage report](http://gitlab.quasipaa.cn/quasipaa/nursery/badges/master/coverage.svg)](http://gitlab.quasipaa.cn/quasipaa/nursery/commits/master)


### Source
- [Docker Hub](https://hub.docker.com/u/quasipaa) Contains all services of the service group.</br>
- [Git](https://github.com/quasipaa/nursery) Project code management and automatic integration.</br>
- [Document](./doc) Contains project details document.</br>


### Future
* [x] Docker compose.<br>
* [x] MongoDB replication.</br>
* [x] MongoDB multi-document transaction and driver's secondary packaging.</br>
* [x] RabbitMQ drives secondary packaging and adds RPC features.</br>
* [x] Core service transactions and retry mechanisms.</br>
* [ ] Database model design.</br>
* [x] Core service.</br>
* [x] Interface service.</br>
* [x] Disk service.</br>
* [ ] Proxy service.</br>
* [x] Media service.</br>
* [x] Cache service.</br>
* [x] Log collection and data analysis.</br>
* [ ] Document.</br>
* [x] CI/CD.</br>
* [x] Unit testing.</br>
* [ ] System testing.</br>


### Overview
* Use `GitLab CI/CD` as a continuous integration and testing tool.</br>
* Use `Docker` as a container service and mirror hosting.</br>
* `Docker` container does not contain other middleware.</br>
* Each service runs a separate `Docker` image.</br>
* The project contains multiple services, each service provides independent operation and does not affect other services.</br>
* Tasks are passed through the message queue. The message queue driver adds RPC functionality and can use callbacks.</br>
* The database is a multi-instance cluster. The core transaction data is all processed by multiple document transactions, and the retry mechanism is implemented. It will retry multiple times for the specified transaction. If it is still unable to process after retry, it will pass the error through the message queue.</br>
* External interface uses parameter verification to ensure interface security.</br>
* Administrator interface better manages data templates and rights management through `GraphQL`.</br>
* The global status code is stored in the `code.json` file, and the entire system includes external services, all communicating via status codes.</br>
* External static files are uniformly distributed and processed through the `disk` service.</br>
* The Message Queuing RPC feature defaults to a global 1 minute timeout. If this limit is exceeded, the current task will be closed. (The restriction here is to avoid the infinite hang of the asynchronous stack and the memory overflow)</br>
* The internal `Express` of the project is a custom framework, which is different from the common source code and cannot be replaced with the generic `Express`. (`lazy_mod / express` adds async error hooks and async return hooks)</br>
* `Elasticsearch` is used to collect service and system operation logs and performance data, and use batch writes inside the service to avoid pipe back pressure.</br>


### Git
* `master` is a protection branch and cannot be submitted directly. `dev` is a test branch. All submissions must be submitted to the `dev` branch for automated testing.</br>
* Every developer creates their own branch, not multiple developers share the same branch.</br>
* Each branch's update commits the `PR` to `dev` branch, and the questions and tasks are submitted to `issue` waiting for the developer to process.</br>


### Environmental variable
> The configuration file is in TOML format.
* `NURSERY_CORE_CONFGILE` Core service configure.</br>
* `NURSERY_DISK_CONFFILE` Disk service configure.</br>
* `NURSERY_INTERFACE_CONFFILE` Interface service configure.</br>
* `NURSERY_CACHE_CONFFILE` Cache service configure.</br>
* `NURSERY_DEVICE_CONFFILE` Device service configure.</br>
* `NURSERY_MEDIA_CONFFILE` Media service configure.</br>


### Project structure
* `.autodevops` auto devops.</br>
* `analysis` Responsible for processing performance data and logs.</br>
* `bin` Dynamic dependency library.</br>
* `configure` Configure files.</br>
* `factory` Factory function.</br>
* `guard` Some independently running tasks.</br>
* `model` Data layer model.</br>
* `router` Express router.</br>
* `service` Service unit.</br>
* `.testing` Unit testing.</br>
* `.alinode.json` AliNode configure.</br>
* `.gitlab-ci.yml` GitLab CI/CD configure.</br>
* `cluster.js` Self-encapsulated service cluster.</br>
* `docker-compose.yml` Docker compose configure.</br>
* `ecosystem.config.js` PM2 service configure.</br>
* `code.json` Status code.</br>
* `middleware.js` Express middleware.</br>
* `model.rs` Database model Document.</br>


### External dependence
* `GitLab` Git or CI/CD.</br> 
* `Kubernetes`</br>
* `Docker`</br>
* `MongoDB` Master Database.</br> 
* `Redis` Cache.</br>
* `RabbitMQ` Mqtt.</br>
* `Elasticsearch` Logs.</br>
* `FFmpeg` Media.</br>


### License
[MIT](./LICENSE)
Copyright (c) 2019 Mr.Panda.