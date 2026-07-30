// PM2 Ecosystem Config — production process management
// Usage: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: "clipper-web",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: process.cwd(),
      instances: process.env.NODE_ENV === "production" ? 2 : 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      max_memory_restart: "512M",
      error_file: "/var/log/clipper/web-error.log",
      out_file: "/var/log/clipper/web-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "clipper-worker",
      script: "src/worker.ts",
      interpreter: "node_modules/.bin/tsx",
      cwd: process.cwd(),
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "1G",
      error_file: "/var/log/clipper/worker-error.log",
      out_file: "/var/log/clipper/worker-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      kill_timeout: 60_000, // 60s graceful shutdown for in-flight jobs
    },
  ],
};
