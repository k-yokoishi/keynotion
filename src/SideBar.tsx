/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'
import './SideBar.css'
import { css } from '@emotion/react'

type Heading = {
  id: string
  level: 1 | 2 | 3
  textContent: string
}

export const SideBar = () => {
  const [headingList, setHeadingList] = useState<Heading[]>([])
  useEffect(() => {
    const temp: Heading[] = []
    document.querySelectorAll<HTMLDivElement>('div.notion-page-content div').forEach((el) => {
      const classList = el.classList
      if (classList.contains('notion-header-block')) {
        console.log('push 1', el.textContent)
        temp.push({ id: el.getAttribute('data-block-id')!, level: 1, textContent: el.innerText })
      } else if (classList.contains('notion-sub_header-block')) {
        console.log('push 2', el.textContent)
        temp.push({ id: el.getAttribute('data-block-id')!, level: 2, textContent: el.innerText })
      } else if (classList.contains('notion-sub_sub_header-block')) {
        console.log('push 3', el.textContent)
        temp.push({ id: el.getAttribute('data-block-id')!, level: 3, textContent: el.innerText })
      }
    })
    setHeadingList(temp)
  }, [])
  return (
    <div className="SideBar">
      <ul css={outlineListCss}>
        {headingList.map((heading) => (
          <li css={outlineListItemCss} key={heading.id}>
            <button>{heading.textContent}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const outlineListCss = css({
  listStyle: 'none',
})
const outlineListItemCss = css({
  '&:hover': {
    backgroundColor: 'gray',
  },
})
