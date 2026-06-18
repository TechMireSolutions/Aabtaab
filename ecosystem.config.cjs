/** PM2 process config — port from server.config.cjs */
const { PRODUCTION_PORT } = require("./server.config.cjs");

module.exports = {
  apps: [
    {
      name: "aabtaab-next",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: PRODUCTION_PORT,
      },
    },
  ],
};
