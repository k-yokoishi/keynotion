import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

export type HeaderLevel = 1 | 2 | 3

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
  currentlyViewed: boolean
}

const outlineAtom = atom<OutlineItem[]>([])

export const useOutline = () => {
  const [outline, setOutline] = useAtom(outlineAtom)
  return {
    outline,
    setOutline,
  }
}

export const useOutlineValue = () => useAtomValue(outlineAtom)

export const useSetOutline = () => useSetAtom(outlineAtom)
