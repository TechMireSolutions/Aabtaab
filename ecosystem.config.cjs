/** PM2 process config — production server always listens on port 3000 */
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
        PORT: 3000,
      },
    },
  ],
};
