/** PM2 process config — port from server.config.cjs */
const { PRODUCTION_PORT } = require("./server.config.cjs");

module.exports = {
  apps: [
    {
      name: "aabtaab-next",
      script: "deploy/runtime.cjs",
      args: [],
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: PRODUCTION_PORT,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
