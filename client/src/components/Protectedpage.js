import React, { useEffect } from "react";
import { message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";

function ProtectedPage({ children }) {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await GetCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
      message.error("Please login to continue");
    }
  }, []);
  return (
    user && (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center bg-primary p-3">
          <h1 className="text-2xl text-white">THE_RESTORE</h1>
          <div className="bg-white px-0.5 py-2 rounded flex gap-1 items-center">
            <i className="ri-user-fill"></i>
            <span className="underline cursor-pointer">{user.name}</span>
            <i
              className="ri-logout-box-r-fill ml-10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        {/*body*/}
        <div className="p-5">{children}</div>
      </div>
    )
  );
}

export default ProtectedPage;
