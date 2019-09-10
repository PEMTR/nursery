module.exports = {
  apps: [{
    name: "nursery.interface",
    script: "src/interface.js",
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.core",
    script: "src/core.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.disk",
    script: "src/disk.js",
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.media",
    script: "src/media.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.cache",
    script: "src/cache.js",
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }, {
    name: "nursery.guard",
    script: "guard/mod.js",
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