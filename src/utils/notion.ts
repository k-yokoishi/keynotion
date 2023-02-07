export const isHeaderBlock = (el: HTMLElement) =>
  el.classList.contains('notion-header-block') ||
  el.classList.contains('notion-sub_header-block') ||
  el.classList.contains('notion-sub_sub_header-block')

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
export const getMutationType = (mutation: MutationRecord): NotionMutationType => {
  if (mutation.type === 'characterData') {
    return 'addCharacter'
  } else if (mutation.type === 'childList') {
    return 'deleteCharacter'
  } else {
    throw new Error(`Unknown mutation type '${mutation.type}'`)
  }
}

export const findParentBlock = (el: Node | null): HTMLElement | null => {
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
