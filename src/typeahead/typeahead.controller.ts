import { Controller, Get, Param } from '@nestjs/common';

import { TypeaheadService } from './typeahead.service';

@Controller('typeahead')
export class TypeaheadController {
  constructor(private typeaheadService: TypeaheadService) {}
  @Get()
  findAll() {
    return this.typeaheadService.getTopNames();
  }

  @Get(':prefix')
  search(@Param('prefix') prefix: string) {
    return this.typeaheadService.search(prefix);
  }
}
