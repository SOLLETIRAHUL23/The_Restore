import { Upload, Button, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

function Images({ selectedProduct, setShowProductForm, getData }) {
  const [showPreview = false, setShowPreview] = React.useState(true);
  const [images = [], setImages] = React.useState(selectedProduct.images);
  const [file = null, setFile] = useState(null);
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
  const upload = async () => {
    try {
      dispatch(SetLoader(true));
      // Upload Image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      console.log(response);
      dispatch(SetLoader(false));
      if (response.success) {
        showNotification("success", response.message);
        setImages([...images, response.data]);
        setShowPreview(false);
        setFile(null);
        getData();
      } else {
        showNotification("error", response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      showNotification("error", error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedImagesArray = images.filter((img) => img !== image);
      const updatedProduct = { ...selectedProduct, images: updatedImagesArray };
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      if (response.success) {
        showNotification("success", response.message);
        //message.success(response.message);
        setImages(updatedImagesArray);
        setFile(null);
        getData();
      } else {
        showNotification("error", response.message);
        throw new Error(response.message);
      }

      dispatch(SetLoader(true));
    } catch (error) {
      dispatch(SetLoader(false));
      showNotification("error", error.message);
      message.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex gap-5 mb-5">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end">
              <img className="h-20 w-20 object-cover" src={image} alt="" />
              <i
                className="ri-delete-bin-line"
                onClick={() => deleteImage(image)}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}
      >
        <button type="dashed">Upload Image</button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>

        <Button type="primary" disabled={!file} onClick={upload}>
          Upload
        </Button>
      </div>
    </div>
  );
}

export default Images;
