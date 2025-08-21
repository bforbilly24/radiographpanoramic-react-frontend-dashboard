const formatColumnName = (columnId: string): string => {
  if (columnId.toLowerCase() === 'id') return 'ID'

  const withSpaces = columnId
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/\s+/g, ' ')

  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

export { formatColumnName }
