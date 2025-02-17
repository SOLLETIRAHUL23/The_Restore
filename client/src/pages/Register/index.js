// import React from "react";
// import { Button, Form, Input, message, notification } from "antd";
// import Divider from "../../components/Divider";
// import { Link } from "react-router-dom";
// import { RegisterUser } from "../../apicalls/users";

// const rules = [
//   {
//     required: true,
//     message: "required",
//   },
// ];

// // function Register() {
// //   const onFinish = async (values) => {
// //     try {
// //       const response = await RegisterUser(values);
// //       if (response.success) {
// //         message.success(response.message);
// //         //console.log(response.message);
// //       } else {
// //         throw new Error(response.message);
// //         //console.log(response.message);
// //       }
// //     } catch (error) {
// //       message.error(error.message);
// //       //console.log(error.message);
// //     }
// //   };

// function Register() {
//   const onFinish = async (values) => {
//     try {
//       const response = await RegisterUser(values);

//       if (response.success) {
//         message.success(response.message);
//         // Show success notification
//         notification.success({
//           message: response.message, // Title of the notification
//           description: response.message, // Description from the server response
//           placement: "top", // This places the notification at the top of the page
//           duration: 3,
//         });
//       } else {
//         // Show error notification if something went wrong
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       message.error(error.message);
//       // Show error notification in case of a catch block error
//       notification.error({
//         message: error.message, // Title of the notification
//         description: error.message, // Error message from the catch block
//         placement: "top", // This places the notification at the top of the page
//         duration: 3,
//       });
//     }
//   };

//   return (
//     <div className="h-screen bg-primary flex justify-center items-center">
//       <div className="bg-white p-5 rounded w-[450px]">
//         <h1 className="text-primary text-2xl">
//           The_RESTORE - <span className="text-gray-400">REGISTER</span>
//         </h1>
//         <Divider />
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item label="Name" name="name" rules={rules}>
//             <Input placeholder="Name" />
//           </Form.Item>
//           <Form.Item label="Email" name="email" rules={rules}>
//             <Input placeholder="Email" />
//           </Form.Item>
//           <Form.Item label="Password" name="password" rules={rules}>
//             <Input type="password" placeholder="password" />
//           </Form.Item>
//           <Button type="primary" htmlType="submit" block className="mt-2">
//             Register
//           </Button>

//           <div className="mt-5 text-center">
//             <span className="text gray-500">
//               Already have an account?{" "}
//               <Link to="/login" className="text-primary">
//                 Login
//               </Link>
//             </span>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default Register;
import React from "react";
import { Button, Form, Input } from "antd";
import { RegisterUser } from "../../apicalls/users"; // Assuming you have a function to register users.

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

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);

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
