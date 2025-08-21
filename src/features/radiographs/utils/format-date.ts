function formatDate(dateString: string): string {
  return new Date(dateString)
    .toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(' pukul ', ', ')
}

export { formatDate }
