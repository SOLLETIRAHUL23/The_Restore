import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";
import moment from "moment";
import Products from "./Products";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";

function Users() {
  const [users, setUsers] = React.useState([]);
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
  console.log("users", users);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers(JSON.parse(JSON.stringify(users)));
      console.log(response);
      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.error("API error:", error); // Log the error for better
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, Status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, Status);
      dispatch(SetLoader(false));
      if (response.success) {
        showNotification("success", response.message);
        message.success(response.message);
        getData();
      } else {
        showNotification("error", response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      showNotification("error", error.message);
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.Status.toUpperCase();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { Status, _id } = record;
        return (
          <div className="flex gap-3">
            {Status === "active" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {Status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "active")}
              >
                unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default Users;
