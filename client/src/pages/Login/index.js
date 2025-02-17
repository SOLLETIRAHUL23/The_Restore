import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";

const rules = [
  {
    required: true,
    message: "required",
  },
];

function Login() {
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
  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);

      if (response.success === true) {
        // Show success notification
        showNotification("success", response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        // Show error notification
        showNotification("error", response.message);
        console.log(response.message);
      }
    } catch (error) {
      // Show error notification in case of a network issue or other error
      showNotification("error", error.message);
      console.log(error.message);
    }
  };
  // const onFinish = async (values) => {
  //   try {
  //     const response = await LoginUser(values);
  //     if (response.success) {
  //       message.success(response.message);
  //       localStorage.setItem("token", response.data);
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error) {
  //     message.error(error.message);
  //   }
  // };
  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">
          The_RESTORE - <span className="text-gray-400">LOGIN</span>
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block className="mt-2">
            Login
          </Button>

          <div className="mt-5 text-center">
            <span className="text gray-500">
              Dont have an account?{" "}
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
