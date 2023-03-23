import { useEffect, useState } from 'react'
export const useDocument = (doc: Document) => {
  const [title, setTitle] = useState('')
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setTitle(doc.title)
    setPathname(doc.location.pathname)
    const documentObserver = new MutationObserver(() => {
      if (title !== doc.title) setTitle(doc.title)
      if (pathname !== doc.location.pathname) setPathname(doc.location.pathname)
    })
    return () => documentObserver.disconnect()
  }, [doc.location.pathname, doc.title, pathname, title])

  return {
    title,
    pathname,
  }
}
