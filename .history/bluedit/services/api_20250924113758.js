// services/api.js
export const loginUser = async (email, password) => {
  // Mock backend response
  if (email === "test@user.com" && password === "123456") {
    return { success: true };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};
