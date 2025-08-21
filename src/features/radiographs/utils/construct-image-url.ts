import { imageUrl } from '@/types/environment'

function constructImageUrl(path: string | null): string {
  if (!path) {
    return ''
  }
  if (path.startsWith('data:image')) {
    return path
  }
  const normalizedPath = path
    .replace(/^Uploads\//, 'uploads/')
    .replace(/\.+/g, '.')
  const encodedPath = normalizedPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `${imageUrl}/${encodedPath}`
}

export { constructImageUrl }
