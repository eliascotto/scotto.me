import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that converts images with title attributes into figure elements
 * This handles markdown syntax like ![alt](src "title")
 */
export const rehypeFigureImages: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img' && node.properties?.title) {
        const title = node.properties.title as string;
        const imgNode = { ...node };
        // Remove title from img since we'll use it in figcaption
        delete imgNode.properties.title;
        
        // Create figure element
        const figureNode = {
          type: 'element' as const,
          tagName: 'figure',
          properties: {},
          children: [
            imgNode,
            {
              type: 'element' as const,
              tagName: 'figcaption',
              properties: {},
              children: [
                {
                  type: 'text' as const,
                  value: title,
                },
              ],
            },
          ],
        };
        
        // Replace img with figure
        if (parent && typeof index === 'number') {
          parent.children[index] = figureNode;
        }
      }
    });
  };
};

