export function log(...args) {
  if (import.meta.env.MODE !== 'production') {
    console.log(...args);
  }
}

export function error(...args) {
  if (import.meta.env.MODE !== 'production') {
    console.error(...args);
  }
}
