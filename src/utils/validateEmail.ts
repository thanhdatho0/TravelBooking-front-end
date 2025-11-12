// utils/validateEmail.ts

/**
 * Regex kiểm tra email hợp lệ
 * Hỗ trợ: Unicode (nếu cần), ký tự đặc biệt hợp lệ, tên miền có dấu gạch ngang
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Hàm validate email
 * @param email - Chuỗi email cần kiểm tra
 * @returns { isValid: boolean; error: string | null }
 */
export const validateEmail = (
  email: string
): { isValid: boolean; error: string | null } => {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: "Email không được để trống." };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: "Email không hợp lệ. Vui lòng nhập đúng định dạng.",
    };
  }

  return { isValid: true, error: null };
};
