import { NamePopularity } from './name-popularity.interface';

export class NameTreeNode {
  private leaves: NameTreeNode[];
  private isEdgeLeaf: boolean;

  constructor(private nodeValue?: NamePopularity) {
    this.leaves = Array();
    this.isEdgeLeaf = false;
  }

  containsKey(key: string) {
    return this.leaves[key] !== null && this.leaves[key] !== undefined;
  }

  getNode(key: string) {
    return this.leaves[key];
  }

  getNodeValue(): NamePopularity | undefined {
    return this.nodeValue;
  }

  getChildNodesCount() {
    return this.leaves.length;
  }

  getChildNodes() {
    return this.leaves;
  }

  putNode(key: string, node: NameTreeNode) {
    this.leaves[key] = node;
  }

  setEnd() {
    this.isEdgeLeaf = true;
  }

  increasePopularity() {
    if (this.nodeValue) this.nodeValue.times++;
  }

  isEnd() {
    return this.isEdgeLeaf;
  }
}
