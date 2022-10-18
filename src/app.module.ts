import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TypeaheadService } from './typeahead/typeahead.service';
import { TypeaheadController } from './typeahead/typeahead.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
  ],
  controllers: [TypeaheadController],
  providers: [TypeaheadService],
})
export class AppModule {}
