import { NamePopularityTree } from './name-popularity/name-popularity.class';
import {
  sortByName,
  sortByPopularity,
  findNamesInNode,
  getMostPopularNames,
} from './utils';

const mockNames = [
  {
    name: 'Anne',
    times: 5,
  },
  {
    name: 'Abbie',
    times: 1,
  },
];

const initialMockData = { anne: mockNames[0], abbie: mockNames[1] };

describe('Utils', () => {
  describe('sortByName', () => {
    it('should sort correctly in alphabetical order', () => {
      expect(mockNames.sort(sortByName)[0]).toBe(initialMockData.abbie);
    });
  });
  describe('sortByPopularity', () => {
    it('should sort correctly in descending popularity', () => {
      expect(mockNames.sort(sortByPopularity)[0]).toBe(initialMockData.anne);
    });
  });
  describe('findNamesInNode', () => {
    it('should return names on the leaves of the given tree section', () => {
      const rootTree = new NamePopularityTree(initialMockData);
      const names = findNamesInNode(rootTree.root, 2);
      expect(names.map((v) => v.name)).toStrictEqual(mockNames.map((v) => v.name));
    });
  });
  describe('getMostPopularNames', () => {
    it('should return the top N most popular names for the given array', () => {
      expect(getMostPopularNames(1, mockNames)).toStrictEqual([initialMockData.anne]);
    });
  });
});
