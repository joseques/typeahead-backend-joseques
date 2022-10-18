import { NameTreeNode } from './name-tree-node.class';
import { NamePopularity } from 'name-popularity/name-popularity.interface';
import {
  findNamesInNode,
  getMostPopularNames,
  sortByPopularity,
} from '../utils';
import Constants from '../constants';

export class NamePopularityTree {
  // Index the top popular names for fast access
  // No need to traverse the tree to get the top SUGGESTION_NUMBER
  mostPopularNames: Array<NamePopularity>;
  root: NameTreeNode;

  constructor(
    initialData: Record<string, NamePopularity>,
    private maxSuggestions: number = 10,
  ) {
    this.mostPopularNames = new Array(maxSuggestions);
    this.root = new NameTreeNode();
    this.insert(Object.values(initialData));
  }

  /**
   * Inserts every letter of each word by creating a new NameTreeNode
   * @param names dictionary of names to be inserted
   */
  insert(names: NamePopularity[]) {
    for (const nameItem of names) {
      let node = this.root;
      for (let i = 0; i < nameItem.name.length; i++) {
        const currentChar = nameItem.name.charAt(i).toLocaleLowerCase();
        if (!node.containsKey(currentChar)) {
          node.putNode(currentChar, new NameTreeNode(nameItem));
          const newMostPopularNames = getMostPopularNames(this.maxSuggestions, [
            nameItem,
            ...this.mostPopularNames,
          ]);

          if (
            !this.mostPopularNames.includes(nameItem) &&
            newMostPopularNames.includes(nameItem)
          ) {
            this.mostPopularNames = newMostPopularNames;
          }
        }
        node = node.getNode(currentChar);
      }
      node.setEnd();
    }
  }

  /**
   * Gets all names from most popular to least popular
   * @param limit limit to return
   * @returns
   */
  getAllNames(
    limit: number = Constants.MAX_TYPEAHEAD_RESULTS,
  ): NamePopularity[] {
    return this.mostPopularNames;
  }

  /**
   * Searches, maps to @Name type and returns the results sorted by popularity
   * @param prefix prefix to search
   * @param limit limit names to search
   * @returns the list of names found for the given prefix
   */
  search(prefix: string, limit?: number): NamePopularity[] {
    return this.findNamesWithPrefix(prefix, limit, sortByPopularity);
  }

  /**
   * For internal usage. Will return every COMPLETE name that starts with the given prefix.
   * @param prefix prefix to search
   * @param limit limit names to search
   * @returns list of found names
   */
  private findNamesWithPrefix(
    prefix: string,
    limit?: number,
    sortedBy?: (a: NamePopularity, b: NamePopularity) => number,
  ): NamePopularity[] {
    let names: NamePopularity[] = [];
    let node = this.root;
    // Find the match with the prefix
    for (let i = 0; i < prefix.length; i++) {
      const currentChar = prefix.charAt(i).toLocaleLowerCase();
      // Check if key is contained in the tree
      if (node.containsKey(currentChar)) {
        node = node.getNode(currentChar);
      }
    }

    // Traverse tree to discover existing name in branch
    if (node) names = findNamesInNode(node, limit);

    const newMostPopularNames = getMostPopularNames(this.maxSuggestions, [
      ...this.mostPopularNames.map(
        (mpName) =>
          names
            .find((name) => name.name === mpName.name) ?? mpName,
      ),
    ]).sort(sortByPopularity);

    if (newMostPopularNames !== this.mostPopularNames) {
      this.mostPopularNames = newMostPopularNames;
    }

    // Sort with provided
    if (sortedBy) names = names.sort(sortedBy);

    return names;
  }
}
