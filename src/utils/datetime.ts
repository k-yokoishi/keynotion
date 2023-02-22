export const getMilliseconds = (text: string): number | null => {
  const matchedMinutes = text.match(/([0-9]+)min/)
  if (matchedMinutes) {
    return matchedMinutes !== null ? parseInt(matchedMinutes[1]) * 60 * 1000 : null
  }
  const matchedSeconds = text.match(/([0-9]+)sec/)
  if (matchedSeconds) {
    return matchedSeconds !== null ? parseInt(matchedSeconds[1]) * 1000 : null
  }
  return null
}
