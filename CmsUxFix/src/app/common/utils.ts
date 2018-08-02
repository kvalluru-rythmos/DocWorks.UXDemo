import {URLSearchParams} from '@angular/http';
import {TreeNode} from 'primeng/components/common/api';
import * as _ from 'underscore';
import {Optional} from '@angular/core';

export function urlEncode(obj: Object): string {
  const urlSearchParams = new URLSearchParams();
  // tslint:disable-next-line:forin
  for (const key in obj) {
    urlSearchParams.append(key, obj[key]);
  }
  return urlSearchParams.toString();
}

// tslint:disable-next-line:class-name
export class utils {
  clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  listToTree(array: any[]): any[] {
    const parentIds = _.pluck(array, 'parentId');
    const nodeIds = _.pluck(array, 'nodeId');
    const masterNodeId = _.first(_.difference(parentIds, nodeIds));
    return this.createTree(array, undefined, undefined, masterNodeId);
  }

  createTree(array: any[], parent: any, tree: any[], masterNodeId: string) {
    tree = tree ? tree : [];
    parent = parent ? parent : {nodeId: masterNodeId};
    let children = _.filter(array, function (child) {
      return child.parentId === parent.nodeId;
    });
    if (!_.isEmpty(children)) {
      children = _.sortBy(children, 'nodeOrderIndex');
      if (parent.nodeId === masterNodeId) {
        tree = children;
      } else {
        parent['children'] = children;
      }
      _.each(children, function (child) {
        this.createTree(array, child, undefined, masterNodeId);
      }.bind(this));
    }
    return tree;
  }

  searchTree(value, searchText: string, filterTree: boolean) {
    if (searchText.length < 3 && !filterTree) {
      return value;
    }
    _.each(value, function (node) {
      if (node.children) {
        node.children = this.searchTree(node.children, searchText, filterTree);
        if (_.filter(node.children, function (data) {
            return data.styleClass === 'visible';
          }).length === 0) {
          if (node.label.toLowerCase().indexOf(searchText.toLowerCase()) < 0) {
            node['styleClass'] = 'inVisible';
          }
        } else {
          node['styleClass'] = 'visible';
        }
      } else {
        if (node.label.toLowerCase().indexOf(searchText.toLowerCase()) < 0) {
          node['styleClass'] = 'inVisible';
        }
      }
    }.bind(this));
    return value;
  }

  setNodeProperties(nodeList, propertyName, propertyValue, param, value) {
    if (propertyValue) {
      _.each(nodeList, function (node) {
        if (node[propertyName] === propertyValue) {
          node[param] = value;
        }
        if (node.children) {
          node.children = this.setNodeProperties(node.children, propertyName, propertyValue, param, value);
        }
      }.bind(this));
    }
    return nodeList;
  }

  findNodeHierarchy(nodeId, nodeList, @Optional() nodeHierarchyArray = []) {
    if (!nodeList || nodeList.length < 1) {
      return;
    }
    const currentNode = _.find(nodeList, function (value) {
      return nodeId === value.nodeId;
    });

    if (currentNode) {
      nodeHierarchyArray.push(currentNode);
      if (currentNode.parentId) {
        this.findNodeHierarchy(currentNode.parentId, nodeList, nodeHierarchyArray);
      }
    }
    return nodeHierarchyArray;
  }

  returnMatchedNode(hierarchy: [string], nodeTree) {
    let returnNode;
    let tempTree = nodeTree;
    if (hierarchy && hierarchy.length > 0) {
      let length = hierarchy.length;
      while (length > 0) {
        length--;
        returnNode = _.find(tempTree, function (value) {
          return value.shortTitle === hierarchy[length];
        });
        if (returnNode && returnNode.children) {
          tempTree = returnNode.children;
        }
      }
    }
    return returnNode;
  }

  convertAndResetPrimeNgTree(tree: any[], expandedIcon: string, collapsedIcon: string, fileIcon: string, @Optional() isExpanded = false): TreeNode[] {
    _.each(tree, function (node) {
      node['label'] = node['shortTitle'];
      node['expanded'] = isExpanded;
      node['isChecked'] = undefined;
      node['manuallyMatched'] = undefined;
      node['isMatched'] = undefined;
      if (node['isFolder']) {
        node['expandedIcon'] = expandedIcon;
        node['collapsedIcon'] = collapsedIcon;
        node['selectable'] = false;
      } else {
        node['icon'] = fileIcon;
      }
      node['data'] = {'documentId': node.nodeId, 'name': node.label};
      if (node['children'] && node['children'].length > 0) {
        this.convertAndResetPrimeNgTree(node.children, expandedIcon, collapsedIcon, fileIcon, isExpanded);
      }
    }.bind(this));
    return tree;
  }

  implementTagSearch(nodeList, tags) {
    _.each(nodeList, function (node) {
      node['styleClass'] = 'visible';
      if (node.children) {
        node.children = this.implementTagSearch(node.children, tags);
        if (_.filter(node.children, function (data) {
            return data.styleClass === 'visible';
          }).length === 0) {
          _.each(tags, function (tagGroup) {
            if (tagGroup.tagIds.length > 0 && _.intersection(tagGroup.tagIds, node.tags).length < 1) {
              node.styleClass = 'inVisible';
            }
          });
        } else {
          node['styleClass'] = 'visible';
        }
      } else {
        node.styleClass = node.styleClass && node.styleClass === 'inVisible' ? '' : 'visible';
        _.each(tags, function (tagGroup) {
          if (tagGroup.tagIds.length > 0 && _.intersection(tagGroup.tagIds, node.tags).length < 1) {
            node.styleClass = 'inVisible';
          }
        });
      }
    }.bind(this));
    return nodeList;
  }

  addRemoveNodeFromTree(nodeList, value, parentId, isAdd) {
    _.each(nodeList, function (node) {
      if (parentId === node.nodeId && node.isDragDropNode === true) {
        if (isAdd) {
          node.children = node.children ? node.children : [];
          node.isDragDropNode = false;
          node.children.push(value);
        } else {
          node.children = _.filter(node.children, function (child) {
            return child.nodeId !== value.nodeId;
          });
        }
      } else {
        if (node.children) {
          node.children = this.addRemoveNodeFromTree(node.children, value, parentId, isAdd);
        }
      }
    }.bind(this));

    return nodeList;
  }

  convertCustomTagsToMDContent(content) {
    return content.replace(/(?:<dw-image>)/g, '&lt;dw-image&gt;')
      .replace(/(?:<\/dw-image>)/g, '&lt;/dw-image&gt;')
      .replace(/(?:<dw-link>)/g, '&lt;dw-link&gt;')
      .replace(/(?:<\/dw-link>)/g, '&lt;/dw-link&gt;')
      .replace(/(?:<dw-code>)/g, '&lt;dw-code&gt;')
      .replace(/(?:<\/dw-code>)/g, '&lt;/dw-code&gt;');
  }

  // Need this to convert pascal case to camel case, as it was expected server to send camel case, but it is sending pascal case.
  toCamel(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === 'object') {
          value = this.toCamel(value);
        }
        return value;
      }.bind(this));
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
          value = o[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.toCamel(value);
          }
          newO[newKey] = value;
        }
      }
    }
    return newO;
  }
}



