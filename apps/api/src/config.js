import 'dotenv/config';
import path from 'node:path';

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-before-deploy',
  otpCode: process.env.OTP_BYPASS_CODE || '123456',
  dataFile: path.resolve(process.cwd(), process.env.DATA_FILE || './data/db.json'),
  origins: (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://localhost:8081,http://localhost:19006').split(',').map((value) => value.trim()),
};
