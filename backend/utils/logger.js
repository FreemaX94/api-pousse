function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
}

function error(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...args);
  }
}

module.exports = { log, error };
