const chalk = require("chalk");

const formatTime = () => new Date().toISOString();

module.exports = {
  log: (...args) => {
    console.log(chalk.greenBright(`[LOG ${formatTime()}]`), ...args);
  },
  warn: (...args) => {
    console.warn(chalk.yellowBright(`[WARN ${formatTime()}]`), ...args);
  },
  error: (...args) => {
    console.error(chalk.redBright(`[ERROR ${formatTime()}]`), ...args);
  },
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(chalk.cyan(`[DEBUG ${formatTime()}]`), ...args);
    }
  },
};
