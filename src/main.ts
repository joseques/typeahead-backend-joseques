import { NestFactory } from '@nestjs/core';

import Constants from './constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: function (origin, callback) {
      if (origin == Constants.ALLOWED_ORIGIN) {
        callback(null, true);
      } else {
        console.log('Blocked request for:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  await app.listen(Constants.PORT);
}
bootstrap();
