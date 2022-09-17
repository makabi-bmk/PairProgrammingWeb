module.exports = {
    apps: [
      {
        name: 'NuxtAppName',
        exec_mode: 'cluster',
        instances: 'max', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        ignore_watch: ["logs"],
        args: 'start'
      }
    ]
  }