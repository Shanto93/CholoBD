import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnv = (): IEnv => {
  const requiredEnvVariable: string[] = ["PORT", "DB_URL", "NODE_ENV"];
  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const EnvConfig: IEnv = loadEnv();
