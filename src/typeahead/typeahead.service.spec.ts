import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeaheadService } from './typeahead.service';

describe('TypeaheadService', () => {
  let service: TypeaheadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeaheadService, ConfigService],
    }).compile();

    service = module.get<TypeaheadService>(TypeaheadService);
  });

  describe('getAll', () => {
    it('should return top n names by popularity', () => {
      const firstTop = service.getTopNames(1);
      expect(firstTop[0]).toStrictEqual({ name: 'Fidela', times: 999 });

      service.search('Gert', 1);

      const secondTop = service.getTopNames(1);
      expect(secondTop[0]).toStrictEqual({ name: 'Gert', times: 1000 });
    });
  });

  describe('search', () => {
    it('should find prefix search matches', () => {
      expect(service.search('Abb')).toStrictEqual([
        { name: 'Abbey', times: 674 },
        { name: 'Abby', times: 469 },
        { name: 'Abbie', times: 349 },
      ]);
    });

    it('should find accurate matches', () => {
      expect(service.search('Johnath')).toStrictEqual([
        {
          name: 'Johnath',
          times: 792,
        },
      ]);
    });
  });
});
