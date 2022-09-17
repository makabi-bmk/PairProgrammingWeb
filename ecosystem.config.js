module.exports = {
    apps: [
      {
        name: 'NuxtAppName',
        exec_mode: 'cluster',
        instances: 'max', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        watch: true,
        ignore_watch: [".git/index.lock", "logs", "public", "node_modules", "[\\/\\\\]\\./","pids", ".git", ".idea"],
        args: 'start'
      }
    ]
  }