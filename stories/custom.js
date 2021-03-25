import { node } from 'prop-types';
import React, { Component, useEffect, useRef, useState } from 'react';
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from '../src';
// In your own app, you would need to use import styles once in the app
// import 'react-sortable-tree/styles.css';
import TreeTheme from '../src/Theme';
import { TYPES } from '../src/Theme/NodeContentRenderer';
export const Tree = ({ count }) => {
  const amount = 20;
  const createTreeData = [];
  const [someState] = useState(1);
  const handleClick = id => {
    console.log('click: ' + id, { someState });
  };
  for (let i = 0; i < amount; i++) {
    const element = {
      id: `${i}`,
      type: TYPES.HEADER,
      color: 'green',
      title: `Sprint ${i + 1}`,
      expanded: true,
      children: [
        {
          id: `${i}-t1`,
          type: TYPES.TASK,
          expanded: true,
          count,
          onClick: handleClick,
          title: `task 1 sprint ${i + 1}`,
        },
        {
          id: `${i}-t2`,
          type: TYPES.TASK,
          expanded: true,
          count,
          title: `task 2 sprint ${i + 1}`,
        },
        {
          id: `${i}-t3`,
          type: TYPES.TASK,
          count,
          expanded: true,
          title: `task 3 sprint ${i + 1}`,
        },

        {
          id: `${i}-g2`,
          type: TYPES.GROUPING,
          expanded: true,
          title: 'UX Research',
          children: [
            {
              id: `${i}-t4`,
              type: TYPES.TASK,
              expanded: true,
              count,
              title: `task 4 sprint ${i + 1}`,
            },
            {
              id: `${i}-t5`,
              type: TYPES.TASK,
              expanded: true,
              count,
              title: `task 5 sprint ${i + 1}`,
            },
            {
              id: `${i}-t6`,
              type: TYPES.TASK,
              expanded: true,
              count,
              title: `task 6 sprint ${i + 1}`,
            },
          ],
        },
      ],
    };
    createTreeData.push(element);
  }
  const [treeData, setTreeData] = useState(createTreeData);
  let list = useRef();
  const getNodeKey = ({ node }) => {
    return node.id;
  };

  const updateNode = () => {
    const result = find({
      treeData,
      getNodeKey,
      searchMethod: ({ node, searchQuery }) => node.id === searchQuery,
      searchQuery: '0-t1',
      expandFocusMatchPaths: false,
    });
    if (result?.matches?.length) {
      setTreeData(
        changeNodeAtPath({
          getNodeKey,
          treeData,
          path: result.matches[0].path,
          newNode: { ...result.matches[0].node, count },
        })
      );
    }
  };
  useEffect(() => {
    updateNode();
  }, [count]);

  const canDrag = ({ node }) => {
    return node.type === TYPES.TASK;
  };

  const canDrop = ({ nextParent }) => {
    return (
      nextParent?.type === TYPES.HEADER || nextParent?.type === TYPES.GROUPING
    );
  };

  const [draggedNode, setDraggedNode] = useState(null);
  return (
    <div style={{ height: '100vh' }}>
      <SortableTree
        treeData={treeData}
        onChange={treeData => setTreeData(treeData)}
        theme={TreeTheme}
        canDrag={canDrag}
        canDrop={canDrop}
        slideRegionSize={400}
        getNodeKey={getNodeKey}
        rowHeight={({ treeIndex, node, path }) => {
          switch (node.type) {
            case TYPES.HEADER:
              return 50;
            case TYPES.TASK:
              return 40;
            case TYPES.GROUPING:
              return 31;
          }
        }}
        reactVirtualizedListProps={{
          ref: ref => (list = ref),
        }}
        onDragStateChanged={({ isDragging, draggedNode }) => {
          if (list && isDragging) {
            setDraggedNode(draggedNode);
            list.wrappedInstance.current.recomputeRowHeights();
          } else {
            setDraggedNode(null);
            list.wrappedInstance.current.recomputeRowHeights();
          }
        }}
        onMoveNode={({ isDragging }) => {
          console.log('MOVE NODE');
          if (list) {
            // list.wrappedInstance.current.recomputeRowHeights();
          }
        }}
      />
    </div>
  );
};

export default Tree;
