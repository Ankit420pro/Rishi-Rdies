import 'dotenv/config';
import { app } from './app';
import { config } from './config';
import { prisma } from './db';

const server = app.listen(config.PORT, () => {
  console.info(`RishiRides API listening on port ${config.PORT}`);
  if (config.developmentOtpEnabled) console.warn('Development OTP simulator is enabled; do not use this configuration in production.');
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);