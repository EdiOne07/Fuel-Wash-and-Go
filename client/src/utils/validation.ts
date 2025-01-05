export const validateRegistrationInputs = (
  email: string,
  username: string,
  password: string
): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  if (username.trim().length === 0) return false;
  if (password.length < 6) return false;
  return true;
};