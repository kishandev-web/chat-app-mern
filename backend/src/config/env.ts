/**
 * Environment Variable Validator
 *
 * Yahan saare required env variables validate hote hain.
 * Agar koi variable missing hai toh startup pe hi error aayega —
 * better than a cryptic runtime crash later.
 */

const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "JWT_SECRET",
  "PORT",
] as const;

export const validateEnv = () => {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(", ")}\n` +
        `Please check your .env file.`,
    );
  }

  console.log("✅ Environment variables validated successfully");
};

