import Constants from './constants';
import { NameTreeNode } from 'name-popularity/name-tree-node.class';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { NamePopularity } from 'name-popularity/name-popularity.interface';

export function readNamesSourceSortedBy(
  orderBy: (a: NamePopularity, b: NamePopularity) => number,
): Record<string, NamePopularity> {
  const initialData = JSON.parse(
    readFileSync(resolve(Constants.SOURCE_JSON_FILE)).toString(),
  ) as Record<string, number>;

  var nameEntries = Object.entries(initialData).map(
    (entry) => ({ name: entry[0], times: entry[1] } as NamePopularity),
  );

  // Sort the array based on the second element
  nameEntries.sort(orderBy);

  return nameEntries.reduce((prevName, currName) => {
    return Object.assign(prevName, {
      [currName.name.toLocaleLowerCase()]: {
        name: currName.name,
        times: currName.times,
      } as NamePopularity,
    } as Record<string, NamePopularity>);
  }, {});
}

export function findNamesInNode(
  treeSection: NameTreeNode,
  maxCount?: number,
  names: NamePopularity[] = [],
) {
  if (names.length < maxCount) {
    if (!treeSection.isEnd()) {
      const childNodes = Object.values(treeSection.getChildNodes());
      // Iterate through all children
      for (let index = 0; index < childNodes.length; index++) {
        const node = childNodes[index];
        // Break down childs recursively until theres a complete word
        if (node.isEnd()) {
          names.push(Object.assign({}, node.getNodeValue()));
          node.increasePopularity();
        } else {
          findNamesInNode(node, maxCount, names);
        }
      }
    } else {
      names.push(treeSection.getNodeValue());
      treeSection.increasePopularity();
    }
  }
  return names;
}

export function sortByPopularity(a: NamePopularity, b: NamePopularity) {
  return b.times - a.times;
}

export function sortByName(a: NamePopularity, b: NamePopularity) {
  return a.name.localeCompare(b.name);
}

export function getMostPopularNames(
  topN: number,
  names: NamePopularity[],
): NamePopularity[] {
  return (
    names
      .sort(sortByPopularity)
      // Sort equally popular names by name
      .sort((a, b) => (a.times == b.times ? sortByName(a, b) : 0))
      .slice(0, topN)
  );
}
