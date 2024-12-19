type ValidatorFn = (value: string) => string | null

export const validators: { [key: string]: ValidatorFn[] } = {
  email: [
    (value) => (value.trim() === "" ? "이메일을 입력해주세요." : null),
    (value) =>
      !/^[a-zA-Z0-9._%+\-']+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value.trim())
        ? "유효한 이메일 형식이 아닙니다."
        : null,
  ],
  password: [
    (value) => (value.trim() === "" ? "비밀번호를 입력해주세요." : null),
    (value) =>
      value.trim().length < 8 ? "비밀번호는 8자 이상이어야 합니다." : null,
  ],
}
