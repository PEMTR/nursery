module.exports = {
  apps: [{
    name: "nursery",
    script: "main.js",
    instances: "max",
    autorestart: true,
    watch: false,
    max_memory_restart: "4G"
  }],
  deploy: {
    production: {
      user: "node",
      host: "",
      ref: "origin/master",
      repo: "https://github.com/quasipaa/nursery",
      path: ""
    }
  }
}