import React, { useEffect, useState } from "react";
import { Avatar, Badge, message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { SetLoader } from "../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import Notifications from "./Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";
function ProtectedPage({ children }) {
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showNotification = (type, message) => {
    // Create a notification element
    const notificationContainer = document.createElement("div");
    notificationContainer.className = `notification ${type}`;
    notificationContainer.innerText = message;

    // Append notification to the body
    document.body.appendChild(notificationContainer);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notificationContainer.remove();
    }, 3000);
  };
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        navigate("/login");
        showNotification("error", response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      showNotification("error", error.message);
    }
  };

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();

      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      navigate("/login");
      showNotification("error", "Please login to continue");
    }
  }, []);
  return (
    user && (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center bg-primary p-3">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            THE_RESTORE
          </h1>
          <div className="bg-white px-0.5 py-2 rounded flex gap-1 items-center">
            <i className="ri-user-fill"></i>
            <span
              className="underline cursor-pointer"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/Profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>
            <Badge
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
            >
              <Avatar
                shape="circle"
                icon={<i class="ri-notification-fill"></i>}
              />
            </Badge>
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

        {
          <Notifications
            notifications={notifications}
            reloadNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
}

export default ProtectedPage;
