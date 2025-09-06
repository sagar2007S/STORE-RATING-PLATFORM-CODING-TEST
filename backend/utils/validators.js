export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^\S+@\S+\.\S+$/;
  return re.test(String(email).toLowerCase());
};

export const validateName = (name) => {
  if (!name) return "Name is required";
  const trimmed = String(name).trim();
  if (trimmed.length < 20) return "Name must be at least 20 characters.";
  if (trimmed.length > 60) return "Name must be at most 60 characters.";
  if (/^testuser/i.test(trimmed)) return "Please provide a real name, not a placeholder.";
  return null;
};

export const validateAddress = (address) => {
  if (!address) return null; 
  if (String(address).length > 400) return "Address must be at most 400 characters.";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 16)
    return "Password must be 8–16 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    return "Password must contain at least one special character.";
  return null;
};
