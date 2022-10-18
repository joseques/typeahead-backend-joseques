import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { TypeaheadController } from './typeahead.controller';
import { TypeaheadService } from './typeahead.service';

describe('TypeaheadController', () => {
  let controller: TypeaheadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeaheadController],
      providers: [ConfigService, TypeaheadService],
    }).compile();

    controller = module.get<TypeaheadController>(TypeaheadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
