export function formatCustomDate(dateString: string): string {
  if (!dateString) {
    return ""
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.")
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
