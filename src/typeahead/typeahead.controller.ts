import { Controller, Get, Param } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { TypeaheadService } from './typeahead.service';

@Controller('typeahead')
export class TypeaheadController {
  private readonly logger = new Logger(TypeaheadController.name);

  constructor(private typeaheadService: TypeaheadService) {}

  @Get()
  findAll() {
    this.logger.log(`Get /typeahead/`);
    return this.typeaheadService.getTopNames();
  }

  @Get(':prefix')
  search(@Param('prefix') prefix: string) {
    this.logger.log(`Get /typeahead/${prefix}`);
    return this.typeaheadService.search(prefix);
  }
}
