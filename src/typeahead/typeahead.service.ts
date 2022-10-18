import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { readNamesSourceSortedBy, sortByPopularity } from '../utils';
import { NamePopularity } from '../name-popularity/name-popularity.interface';
import { NamePopularityTree } from '../name-popularity/name-popularity.class';

@Injectable()
export class TypeaheadService {
  db: NamePopularityTree;
  defaultMaxResults: number;
  constructor(private configService: ConfigService) {
    const initialData = readNamesSourceSortedBy(sortByPopularity);

    this.defaultMaxResults = this.configService.get('SUGGESTION_NUMBER') || 10;
    this.db = new NamePopularityTree(initialData);
  }

  getTopNames(limit?: number): NamePopularity[] {
    return this.db.getAllNames(limit || this.defaultMaxResults);
  }

  search(prefix: string, limit?: number): NamePopularity[] {
    return this.db.search(prefix, limit || this.defaultMaxResults);
  }
}
