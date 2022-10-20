import { Logger, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import Constants from './constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [
      'error',
      'warn',
      ...(Constants.ENVIRONMENT === 'development'
        ? ['log', 'verbose', 'debug']
        : []),
    ] as LogLevel[],
  });

  await app.listen(Constants.DEFAULT_PORT, () => {
    Logger.verbose(
      `Listening on port ${Constants.DEFAULT_PORT}`,
    );
  });
}
bootstrap();
