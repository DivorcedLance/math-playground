import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import './App.css'
import { Layout } from './components'
import { HomePage } from './pages/HomePage'
import { FormulasPage } from './pages/FormulasPage'
import { ToolPage } from './pages/ToolPage'

function App() {
  const [path, setPath] = useState<string>(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath)
    setPath(newPath)
  }

  // Inject navigate into window for link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href && target.hostname === window.location.hostname) {
        e.preventDefault()
        navigate(target.pathname + target.search)
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
