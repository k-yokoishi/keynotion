import { isElement } from './dom'

const NotionId = {
  App: 'notion-app',
} as const

const NotionClass = {
  Frame: 'notion-frame',
  PageContent: 'notion-page-content',
  Header: 'notion-header-block',
  SubHeader: 'notion-sub_header-block',
  SubSubHeader: 'notion-sub_sub_header-block',
  Text: 'notion-text-block',
} as const

const NotionAttr = {
  BlockId: 'data-block-id',
} as const

export const isHeaderBlock = (el: HTMLElement) =>
  el.classList.contains(NotionClass.Header) ||
  el.classList.contains(NotionClass.SubHeader) ||
  el.classList.contains(NotionClass.SubSubHeader)

export type HeaderLevel = 1 | 2 | 3
export const getHeaderLevel = (el: HTMLElement): HeaderLevel | null => {
  if (el.classList.contains(NotionClass.Header)) {
    return 1
  } else if (el.classList.contains(NotionClass.SubHeader)) {
    return 2
  } else if (el.classList.contains(NotionClass.SubSubHeader)) {
    return 3
  } else {
    return null
  }
}

type NotionMutationType = 'deleteBlock' | 'deleteCharacter' | 'addCharacter'
type NotionBlockType = 'header' | 'subHeader' | 'subSubHeader' | 'other' // Add block type as needed
type NotionBlock = {
  id: string
  type: NotionBlockType
}
type NotionMutation = {
  type: NotionMutationType
  blockId: string
  blockType: NotionBlockType
  newValue: string
}

export const getNotionAppElement = (doc: Document) => doc.getElementById(NotionId.App)

export const getPageContentElement = (doc: Document) => doc.querySelector(NotionClass.PageContent)

export const getTopbarElement = (doc: Document) => doc.querySelector('.notion-topbar')

export const getNotionFrameElement = (doc: Document) =>
  doc.getElementsByClassName(NotionClass.Frame)[0]

export const getNotionScroller = (doc: Document) =>
  doc.querySelector<HTMLDivElement>('.notion-frame .notion-scroller')

export const getBlockElementById = (blockId: string) => {
  return document.querySelector(`[${NotionAttr.BlockId}="${blockId}"]`) ?? null
}

export const getBlockElements = (doc: Document) => {
  return (
    getPageContentElement(doc)?.querySelectorAll<HTMLDivElement>(`[${NotionAttr.BlockId}]`) ?? null
  )
}

export const getHeaderBlockElements = (doc: Document) =>
  Array.from(
    doc.querySelectorAll<HTMLDivElement>(
      [NotionClass.Header, NotionClass.SubHeader, NotionClass.SubSubHeader]
        .map((v) => `.${v}`)
        .join(',')
    )
  ).filter((el) => {
    // Exclude button that appears aside header
    const hasPlaceholder = !!el.querySelector('[placeholder]')
    return hasPlaceholder
  })

const getNotionBlockType = (blockEl: HTMLElement): NotionBlockType => {
  if (blockEl.classList.contains(NotionClass.Header)) {
    return 'header'
  } else if (blockEl.classList.contains(NotionClass.SubHeader)) {
    return 'subHeader'
  } else if (blockEl.classList.contains(NotionClass.SubSubHeader)) {
    return 'subSubHeader'
  } else {
    return 'other'
  }
}

export const getBlockInfo = (el: HTMLElement): NotionBlock => {
  return {
    id: el.getAttribute('data-block-id') ?? '',
    type: getNotionBlockType(el),
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

export const getProgressBarElement = (doc: Document) => {
  const frameElement = getNotionFrameElement(doc)
  if (!frameElement) return false
  return frameElement.querySelector('[role="progressbar"]')
}
