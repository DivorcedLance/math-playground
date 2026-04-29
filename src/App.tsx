import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import './App.css'
import { Layout } from './components'
import { HomePage } from './pages/HomePage'
import { FormulasPage } from './pages/FormulasPage'
import { ToolPage } from './pages/ToolPage'
import { createAppHref, getAppPathname } from './utils/routing'

function App() {
  const [path, setPath] = useState<string>(() => getAppPathname())

  useEffect(() => {
    const handlePopState = () => setPath(getAppPathname())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (newPath: string) => {
    const url = new URL(newPath, window.location.origin)
    const relativePath = getAppPathname(url.pathname)
    window.history.pushState({}, '', `${createAppHref(relativePath)}${url.search}${url.hash}`)
    setPath(relativePath)
  }

  // Inject navigate into window for link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href && target.hostname === window.location.hostname) {
        e.preventDefault()
        navigate(target.href)
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [])

  let page: ReactElement
  let currentTool: string | undefined

  if (path === '/formulas') {
    page = <FormulasPage />
    currentTool = 'formulas'
  } else if (path.startsWith('/tool/')) {
    const toolId = path.replace('/tool/', '')
    page = <ToolPage toolId={toolId} />
    currentTool = toolId
  } else {
    page = <HomePage />
  }

  return (
    <Layout currentTool={currentTool}>
      {page}
    </Layout>
  )
}

export default App
