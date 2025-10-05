// config.ts
export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL || "postgres://postgres:Vyshnudevi7507@localhost:5432/bouquetbar"
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "AC33481cb2b9a8c5cd0e7ebfa5e7ef41be",
    authToken: process.env.TWILIO_AUTH_TOKEN || "03d1c6447ba02b010d89815819c5fe7e",
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || "VAb363f196c6b6bf4367dcac40bce2704b",
    sms: {
      fromNumber: process.env.TWILIO_PHONE_NUMBER || "+18633431421",
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || ""
    },
    whatsapp: {
      fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || "+18633431421"
    },
    verify: {
      serviceSid: process.env.TWILIO_VERIFY_SERVICE_SID || "VAb363f196c6b6bf4367dcac40bce2704b"
    }
  },
  server: {
    port: Number(process.env.PORT) || 5000,
    host: process.env.HOST || "0.0.0.0",
    cors: {
      origins: (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [
        "http://localhost:5173",
        "http://localhost:5174", // Added for current frontend port
        "http://localhost:4173",
        "http://localhost:8080",
        "https://flowerschoolbengaluru.com",
        "https://app.flowerschoolbengaluru.com",
        "https://localhost:5000"
      ]).map(origin => origin.trim()) // Remove any whitespace
    }
  },
  admin: {
    phone: process.env.ADMIN_PHONE || "+919042358932",
    emails: process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : ["admin@bouquetbar.com", "support@bouquetbar.com", "vasuchouthri811@gmail.com"]
  },
  session: {
    secret: process.env.SESSION_SECRET || "dev_secret"
  },
  ssl: {
    useSSL: process.env.USE_SSL === "true",
    certPath: process.env.SSL_CERT_PATH || "",
    keyPath: process.env.SSL_KEY_PATH || ""
  }
};