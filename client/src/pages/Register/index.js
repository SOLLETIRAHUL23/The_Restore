import React from "react";
import { Button, Form, Input } from "antd";
import { RegisterUser } from "../../apicalls/users"; // Assuming you have a function to register users.
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { useNavigate } from "react-router-dom";

const rules = [
  {
    required: true,
    message: "This field is required",
  },
];

function Register() {
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await RegisterUser(values);
      navigate("/login");
      dispatch(SetLoader(false));

      if (response.success === true) {
        // Show success notification
        showNotification("success", response.message);
        console.log(response.message);
      } else {
        // Show error notification
        showNotification("error", response.message);
        console.log(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      // Show error notification in case of a network issue or other error
      showNotification("error", error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          The_RESTORE - <span className="text-gray-400">REGISTER</span>
        </h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={rules}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block className="mt-2">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
