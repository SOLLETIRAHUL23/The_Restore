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
    console.log("Logging user with payload:", payload);
    return response.data;
  } catch (error) {
    //console.log("Error for user with payload:", payload);
    console.log(error.message);
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

// get all users
export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-users");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// update user status
export const UpdateUserStatus = async (id, Status) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/update-user-status/${id}`,
      { Status }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
