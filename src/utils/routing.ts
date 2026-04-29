const appBase = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')

function toPathname(input: string) {
  return new URL(input, window.location.origin).pathname
}

export function getAppPathname(input: string = window.location.href) {
  const pathname = toPathname(input)

  if (appBase && pathname.startsWith(appBase)) {
    const relativePath = pathname.slice(appBase.length)
    return relativePath === '' ? '/' : relativePath
  }

  return pathname || '/'
}

export function createAppHref(path: string) {
  if (!path.startsWith('/')) return path
  if (!appBase) return path
  return `${appBase}${path}`
}