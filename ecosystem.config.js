module.exports = {
  apps: [{
    name: "nursery.interface",
    script: "service/interface/main.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.core",
    script: "service/core/main.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }],
  deploy: {
    production: {
      user: "node",
      host: "",
      ref: "origin/panda",
      repo: "https://gitee.com/guangzhouchenhuiwangluo/nursery",
      path: ""
    }
  }
}