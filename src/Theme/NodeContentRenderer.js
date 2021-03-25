import React, { Component } from 'react';
import PropTypes, { node } from 'prop-types';
import Styled, { css } from 'styled-components';
import { AIIcon } from './AIIcon';
const styles = {};
export const TYPES = {
  HEADER: 'header',
  TASK: 'task',
  GROUPING: 'grouping',
};
function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

const LineBlock = Styled.div`
height: 100%;
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
`;

const AbsoluteLineBlock = Styled(LineBlock)`
    position: absolute;
  top: 0;
`;

const Row = Styled.div`
  height: 100%;
  white-space: nowrap;
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const dropIndicator = css`
  content: '';
  margin-left: 10%;
  width: 90%;
  height: 2px;
  background: #6e0feb;
  position: absolute;
  bottom: -1px;
`;
const Task = Styled(Row)`
border: 1px solid #e4e4e4;
display: flex;
background-color: rgba(255,255,255,0.3);

width: 2000px;
z-index: 1000;
&:after {
  ${props => props.drop && dropIndicator}
}
`;

const Grouping = Styled(Row)`
    border-bottom: 1px solid #545454;
    height: 20px;
    padding: 2px;
`;
const DragTask = Styled.div`
  white-space: nowrap;
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;
const Header = Styled(Row)`
    background-color: ${({ color }) => color};
    padding: 4px;
`;

const NestedDiv = Styled.div`
    background-color: ${({ level }) => {
      switch (level) {
        case 1:
          return 'teal';
        case 2:
          return 'lime';
        case 3:
          return 'purple';
        case 4:
          return 'blue';
        case 5:
          return 'yellow';
        case 6:
          return 'hotpink';
        case 7:
          return 'brown';
        case 8:
          return 'grey';
        case 9:
          return 'pink';
      }
    }};
    width: ${({ level }) => {
      switch (level) {
        case 1:
          return '50px';
        case 2:
          return '45px';
        case 3:
          return '40px';
        case 4:
          return '35px';
        case 5:
          return '30px';
        case 6:
          return '25px';
        case 7:
          return '20px';
        case 8:
          return '15px';
        case 9:
          return '10px';
      }
    }};
    box-sizing: border-box;
    height: 100%;
    border: 1px solid #545454;
`;

const DragTaskComponent = ({ node }) => {
  return <DragTask>{`DRAGGING-${node.id}-${node.title}`}</DragTask>;
};
const TaskComponent = ({ node }) => {
  return (
    <Task
      drop={node.drop}
      onClick={() => node.onClick && node.onClick(node.id)}
    >
      <div>{`${node.title}-count: ${node.count}`}</div>
    </Task>
  );
};

const HeaderComponent = ({ node, path }) => {
  const handleClick = () => {
    if (node.onClick) {
      node.onClick(node, path);
    }
  };
  return (
    <Header onClick={handleClick} color={node.color}>
      {node.title}
    </Header>
  );
};

const GroupingComponent = ({ node }) => {
  return <Grouping>{node.title}</Grouping>;
};

// eslint-disable-next-line react/prefer-stateless-function
export class NodeContentRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      icons,
      buttons,
      className,
      style,
      didDrop,
      lowerSiblingCounts,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      ...otherProps
    } = this.props;

    // Construct the scaffold representing the structure of the tree
    const scaffold = [];
    lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
      if (i === 0) {
        return;
      }
      scaffold.push(
        <LineBlock
          key={`pre_${1 + i}`}
          style={{ width: scaffoldBlockPxWidth }}
          className={styles.lineBlock}
        />
      );

      if (treeIndex !== listIndex && i === swapDepth) {
        // // This row has been shifted, and is at the depth of
        // // the line pointing to the new destination
        // let highlightLineClass = "";

        // if (listIndex === swapFrom + swapLength - 1) {
        //   // This block is on the bottom (target) line
        //   // This block points at the target block (where the row will go when released)
        //   highlightLineClass = styles.highlightBottomLeftCorner;
        // } else if (treeIndex === swapFrom) {
        //   // This block is on the top (source) line
        //   highlightLineClass = styles.highlightTopLeftCorner;
        // } else {
        //   // This block is between the bottom and top
        //   highlightLineClass = styles.highlightLineVertical;
        // }

        scaffold.push(
          <AbsoluteLineBlock
            key={`highlight_${1 + i}`}
            style={{
              width: scaffoldBlockPxWidth,
              left: scaffoldBlockPxWidth * i,
            }}
          />
        );
      }
    });
    const getElement = node => {
      switch (node.type) {
        case TYPES.HEADER:
          return <HeaderComponent node={node} path={path} />;
        case TYPES.TASK:
          return <TaskComponent node={node} />;
        case TYPES.GROUPING:
          return <GroupingComponent node={node} />;
      }
    };

    const nodeContent = (
      <div
        style={{
          overflow: 'hidden',
          height: '100%',
          width: '130%',
          display: 'flex',
        }}
        {...otherProps}
      >
        {toggleChildrenVisibility && node.children && node.children.length > 0 && (
          <span
            onClick={() =>
              toggleChildrenVisibility({
                node,
                path,
                treeIndex,
              })
            }
          >
            {node.expanded ? '-' : '+'}
          </span>
        )}
        {/* <div
          className={
            styles.rowWrapper +
            (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : "")
          }
        > */}
        {connectDragPreview(
          <div style={{ display: 'flex', width: '130%' }}>
            {scaffold}
            {getElement(node)}
            {/*<Row
              className={
                styles.row +
                (isLandingPadActive ? ` ${styles.rowLandingPad}` : "") +
                (isLandingPadActive && !canDrop
                  ? ` ${styles.rowCancelPad}`
                  : "") +
                (isSearchMatch ? ` ${styles.rowSearchMatch}` : "") +
                (isSearchFocus ? ` ${styles.rowSearchFocus}` : "") +
                (className ? ` ${className}` : "")
              }
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              {node.title}
               <div
                  className={
                    styles.rowContents +
                    (!canDrag ? ` ${styles.rowContentsDragDisabled}` : "")
                  }
                >
                  <div className={styles.rowToolbar}>
                    {icons.map((icon, index) => (
                      <div
                        key={index} // eslint-disable-line react/no-array-index-key
                        className={styles.toolbarButton}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                  <div className={styles.rowLabel}>
                    <span className={styles.rowTitle}>
                      {typeof nodeTitle === "function"
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex,
                          })
                        : nodeTitle}
                    </span>
                  </div>

                  <div className={styles.rowToolbar}>
                    {buttons.map((btn, index) => (
                      <div
                        key={index} // eslint-disable-line react/no-array-index-key
                        className={styles.toolbarButton}
                      >
                        {btn}
                      </div>
                    ))}
                  </div>
                </div> 
            </Row>*/}
          </div>
        )}
      </div>
    );

    return canDrag
      ? connectDragSource(nodeContent, { dropEffect: 'copy' })
      : nodeContent;
  }
}

NodeContentRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
};

NodeContentRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  listIndex: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  rowDirection: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
};

export default NodeContentRenderer;
