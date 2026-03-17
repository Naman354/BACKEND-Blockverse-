module.exports = {
  apps: [
    {
      name: "notes-backend",
      script: "index.js",

      // Use cluster mode for better performance
      exec_mode: "cluster",
      instances: "max", // use all CPU cores

      // Auto restart if crash
      autorestart: true,

      // Restart if memory exceeds limit
      max_memory_restart: "300M",

      // Restart delay to prevent rapid crashes
      restart_delay: 4000,

      // Watch should be OFF in production
      watch: false,

      // Timezone logs
      time: true,

      // Log files
      error_file: "/var/log/notes-backend/error.log",
      out_file: "/var/log/notes-backend/out.log",
      log_file: "/var/log/notes-backend/combined.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",

      env: {
        NODE_ENV: "development",
        PORT: 8080
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};