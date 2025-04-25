export const downloadJSON = (data: object, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = `${filename}.json`
  a.click()

  URL.revokeObjectURL(url)
  a.remove()
}
