export const formatISOTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}
