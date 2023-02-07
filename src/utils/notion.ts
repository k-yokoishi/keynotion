import { isElement } from './dom'
export const isHeaderBlock = (el: HTMLElement) =>
  el.classList.contains('notion-header-block') ||
  el.classList.contains('notion-sub_header-block') ||
  el.classList.contains('notion-sub_sub_header-block')

const NotionBlockTypeClass = {
  Header: 'notion-header-block',
  SubHeader: 'notion-sub_header-block',
  SubSubHeader: 'notion-sub_sub_header-block',
  Text: 'notion-text-block',
} as const

export type HeaderLevel = 1 | 2 | 3
export const getHeaderLevel = (el: HTMLElement): HeaderLevel | null => {
  if (el.classList.contains('notion-header-block')) {
    return 1
  } else if (el.classList.contains('notion-sub_header-block')) {
    return 2
  } else if (el.classList.contains('notion-sub_sub_header-block')) {
    return 3
  } else {
    return null
  }
}

type NotionMutationType = 'deleteBlock' | 'deleteCharacter' | 'addCharacter'
type NotionBlockType = 'header' | 'subHeader' | 'subSubHeader' | 'other' // Add block type as needed
type NotionMutation = {
  type: NotionMutationType
  blockId: string
  blockType: NotionBlockType
  newValue: string
}

const getNotionBlockType = (blockEl: HTMLElement): NotionBlockType => {
  if (blockEl.classList.contains(NotionBlockTypeClass.Header)) {
    return 'header'
  } else if (blockEl.classList.contains(NotionBlockTypeClass.Header)) {
    return 'subHeader'
  } else if (blockEl.classList.contains(NotionBlockTypeClass.SubHeader)) {
    return 'subSubHeader'
  } else if (blockEl.classList.contains(NotionBlockTypeClass.SubSubHeader)) {
    return 'subSubHeader'
  } else {
    return 'other'
  }
}

export const getNotionMutation = (mutation: MutationRecord): NotionMutation => {
  const blockEl = findParentBlock(mutation.target)
  if (blockEl === null) throw new Error('Not found notion block element')
  const blockType = getNotionBlockType(blockEl)
  const blockId = blockEl.getAttribute('data-block-id')
  if (blockId === null) throw new Error('Not found data-block-id attribute of element.')

  if (mutation.type === 'characterData') {
    return {
      type: 'deleteBlock',
      blockId,
      blockType,
      newValue: blockEl.innerText,
    }
  } else if (mutation.type === 'childList') {
    const isAdded = mutation.addedNodes.length > 0
    const isRemoved = mutation.removedNodes.length > 0

    if (!isAdded && isRemoved) {
      // 要素の削除があった場合
      return {
        type: 'deleteCharacter',
        blockId,
        blockType,
        newValue: blockEl.innerText,
      }
    } else if (isAdded && !isRemoved) {
      const addedNode = mutation.addedNodes[0]
      if (!isElement(addedNode)) throw new Error('Added node is not element')
      return {
        type: 'deleteCharacter',
        blockId: addedNode.getAttribute('data-block-id')!,
        blockType: getNotionBlockType(addedNode),
        newValue: blockEl.innerText,
      }
    } else {
      return {
        type: 'deleteCharacter',
        blockId,
        blockType,
        newValue: blockEl.innerText,
      }
    }
  } else {
    throw new Error(`Unknown mutation type '${mutation.type}'`)
  }
}

export const findParentBlock = (el: Node | null): HTMLElement | null => {
  if (el && isElement(el) && el.hasAttribute('data-block-id')) return el
  if (el?.parentElement) {
    if (el.parentElement.hasAttribute('data-block-id')) {
      return el.parentElement
    } else {
      return findParentBlock(el.parentElement)
    }
  } else {
    return null
  }
}
