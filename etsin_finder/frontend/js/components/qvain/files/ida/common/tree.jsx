import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { LinkButton } from '../../../../general/button'
import { Children, ChildrenItem, ItemRow, Items, ItemSpacer, isDirectory } from './items'
import Loader from '../../../../general/loader'

// propagate properties from parent directories
const getParentArgs = (directoryView, parent, parentArgs) => ({
  parentChecked: !!(directoryView.isChecked(parent) || parentArgs.parentChecked),
  parentAdded: !!(parent.added || (parentArgs.parentAdded && !parent.removed)),
  parentRemoved: !!(parent.removed || (parentArgs.parentRemoved && !parent.added)),
})

// limit how many items are shown at once for a directory
export const ShowMore = ({ directoryView, parent, level }) => (
  <ItemRow key="more">
    <ItemSpacer level={level} />
    <LinkButton onClick={() => directoryView.showMore(parent)} type="button">
      Show more
    </LinkButton>
  </ItemRow>
)

ShowMore.propTypes = {
  directoryView: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
}

// draw child items recursively
const drawChildren = (treeProps, parent, level = 0, parentArgs = {}) => {
  const { Item, EmptyHelp, directoryView, moreItemsLevel } = treeProps

  const newParentArgs = getParentArgs(directoryView, parent, parentArgs)

  const items = directoryView.getItems(parent)
  const hasMore = directoryView.hasMore(parent)

  return (
    <Children>
      {items.map((item) => (
        <Fragment key={item.key}>
          <Item treeProps={treeProps} item={item} level={level} parentArgs={newParentArgs} />
          {isDirectory(item) && directoryView.isOpen(item) && (
            <ChildrenItem>{drawChildren(treeProps, item, level + 1, newParentArgs)}</ChildrenItem>
          )}
        </Fragment>
      ))}
      {hasMore && (
        <ShowMore directoryView={directoryView} parent={parent} level={level + moreItemsLevel} />
      )}
      {items.length === 0 && level === 0 && <EmptyHelp />}
    </Children>
  )
}

// returns a function for rendering a file hierarchy
export const useRenderTree = ({
  Files,
  directoryView,
  Item, // component used for rendering a single item
  EmptyHelp = () => null, // component shown when there are no visible items
  moreItemsLevel = 0, // indentation for the "Show All Items" button to account for space taken by buttons
}) => {
  const renderTree = () => {
    const { root, loadingProject } = Files
    const loading = loadingProject && !loadingProject.error
    const treeProps = { Files, Item, directoryView, moreItemsLevel, EmptyHelp }
    return (
      <>
        {loading && <Loader active />}
        <Items>{root && drawChildren(treeProps, root)}</Items>
      </>
    )
  }

  return { renderTree }
}

export default useRenderTree
