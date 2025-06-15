require("dotenv").config();

function getEnv(name, defValue = undefined) {
  const value = process.env[name] || defValue;
  if (value === undefined) {
    throw new Error(`❌ Variable d'environnement manquante : ${name}`);
  }
  return value;
}

module.exports = {
  getEnv, // <--- ajoute cette ligne
  port: parseInt(getEnv("PORT", 3000)),
  mongoURI: getEnv("MONGO_URI"),
  jwtSecret: getEnv("JWT_SECRET"),
  redis: {
    host: getEnv("REDIS_HOST", "127.0.0.1"),
    port: parseInt(getEnv("REDIS_PORT", 6379)),
  },
  email: {
    user: getEnv("EMAIL_USER"),
    pass: getEnv("EMAIL_PASS"),
  },
};
