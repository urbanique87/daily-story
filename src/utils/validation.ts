export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return {
      isValid: false,
      error: "올바른 이메일 형식을 입력해주세요.",
      value: trimmedEmail,
    }
  }

  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: "유효한 이메일 형식이 아닙니다.",
      value: trimmedEmail,
    }
  }

  return { isValid: true, error: null, value: trimmedEmail }
}

export function validatePassword(password: string) {
  if (!password) {
    return {
      isValid: false,
      error: "비밀번호를 입력해주세요.",
      value: password,
    }
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "비밀번호는 8자 이상이어야 합니다.",
      value: password,
    }
  }

  return { isValid: true, error: null, value: password }
}
