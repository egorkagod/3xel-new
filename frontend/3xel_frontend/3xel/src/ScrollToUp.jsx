import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll to top when pathname changes.
// If `watchPathname` is provided, it is used instead of router pathname.
export default function ScrollToUp({ watchPathname }) {
  const { pathname } = useLocation()
  const key = watchPathname ?? pathname

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [key])

  return null
}
