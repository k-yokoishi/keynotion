import { atom, useAtom } from 'jotai'

export type HeaderLevel = 1 | 2 | 3

type OutlineItem = {
  blockId: string
  level: HeaderLevel
  textContent: string
}

const outlineAtom = atom<OutlineItem[]>([])

export const useOutline = () => {
  const [outline, setOutline] = useAtom(outlineAtom)
  const clear = () => setOutline([])
  return {
    outline,
    clear,
    setOutline,
  }
}