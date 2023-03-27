export const getMilliseconds = (text: string): number | null => {
  const matchedMinutes = text.match(/(\d+)\s?(min|minute)s?/)
  if (matchedMinutes) {
    return matchedMinutes !== null ? parseInt(matchedMinutes[1]) * 60 * 1000 : null
  }
  const matchedSeconds = text.match(/(\d+)\s?(sec|second)s?/)
  if (matchedSeconds) {
    return matchedSeconds !== null ? parseInt(matchedSeconds[1]) * 1000 : null
  }
  return null
}
