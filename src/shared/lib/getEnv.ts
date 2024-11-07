export function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`${key} 환경변수가 필요합니다.`)
  }

  return value
}
