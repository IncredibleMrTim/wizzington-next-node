// PM2 Ecosystem Configuration
// This file can be used to start your apps with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'wizz-next',
      script: 'yarn',
      args: 'start:next',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/wizz-next-error.log',
      out_file: './logs/wizz-next-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    },
    {
      name: 'wizz-server',
      script: 'yarn',
      args: 'start:server',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/wizz-server-error.log',
      out_file: './logs/wizz-server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
};
