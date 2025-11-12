// utils/validatePassword.ts

/**
 * Regex kiểm tra password:
 * - Tối thiểu 8 ký tự
 * - Có ít nhất 1 chữ cái (a-z, A-Z)
 * - Có ít nhất 1 số (0-9)
 * - Có ít nhất 1 ký tự đặc biệt: !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;

/**
 * Hàm validate password
 * @param password - Mật khẩu cần kiểm tra
 * @returns { isValid: boolean; error: string | null }
 */
export const validatePassword = (
  password: string
): { isValid: boolean; error: string | null } => {
  const trimmed = password.trim();

  if (!trimmed) {
    return { isValid: false, error: "Mật khẩu không được để trống." };
  }

  if (trimmed.length < 8) {
    return { isValid: false, error: "Mật khẩu phải có ít nhất 8 ký tự." };
  }

  if (!PASSWORD_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: "Mật khẩu phải chứa chữ cái, số và ít nhất 1 ký tự đặc biệt.",
    };
  }

  return { isValid: true, error: null };
};
