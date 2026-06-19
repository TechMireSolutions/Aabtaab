/** PM2 process config — port from server.config.cjs */
const { PRODUCTION_PORT } = require("./server.config.cjs");

module.exports = {
  apps: [
    {
      name: "aabtaab-next",
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${PRODUCTION_PORT}`,
      cwd: __dirname,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: PRODUCTION_PORT,
      },
    },
  ],
};
