import { axiosInstance } from "./axiosinstance";

//register user

export const RegisterUser = async (payload) => {
  try {
    console.log("Registering user with payload:", payload);
    const response = await axiosInstance.post("/api/users/register", payload);
    // console.log("Response", response);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// login user
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//get current user
export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (error) {
    return error.message;
  }
};
