import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

type Title = {
  title: string
}

const titleAtom = atom<Title>({ title: '' })

export const useTitle = () => {
  const [Title, setTitle] = useAtom(titleAtom)
  return {
    Title,
    setTitle,
  }
}

export const useTitleValue = () => useAtomValue(titleAtom)

export const useSetTitle = () => useSetAtom(titleAtom)
