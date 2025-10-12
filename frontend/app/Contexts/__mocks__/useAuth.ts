export const mockUpdateUserPassword = jest.fn();
export const mockPatchUserDetails = jest.fn();
export const mockRegisterUser = jest.fn();
export const mockLoginUser = jest.fn();
export const mockLogoutUser = jest.fn();

export const mockUserDetails = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

export const useAuth = jest.fn(() => ({
  userDetails: mockUserDetails,
  updateUserPassword: mockUpdateUserPassword,
  patchUserDetails: mockPatchUserDetails,
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  logoutUser: mockLogoutUser,
}));
