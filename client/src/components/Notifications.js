import { message, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DeleteNotification } from "../apicalls/notifications";
import { useDispatch } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";

function Notifications({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const deleteNotification = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteNotification(id);
      dispatch(SetLoader(false));
      if (response.success) {
        showNotification("success", response.message);
        reloadNotifications();
      } else {
        showNotification("error", response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      showNotification("error", error.message);
    }
  };
  return (
    <Modal
      title="Notifications"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centered
      width={1000}
    >
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            className="flex flex-col border border-solid p-2 border-gray-300 rounded cursor-pointer"
            key={notification._id}
          >
            <div className="flex justify-between items-center">
              <div
                onClick={() => {
                  navigate(notification.onClick);
                  setShowNotifications(false);
                }}
              >
                <h1 className="text-gray-700">{notification.title}</h1>
                <span className="text-gray-600">{notification.message}</span>
                <h1 className="text-gray-500 text-sm">
                  {moment(notification.createdAt).fromNow()}
                </h1>
              </div>
              <i
                className="ri-delete-bin-line"
                onClick={() => {
                  deleteNotification(notification._id);
                }}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Notifications;
