import React, { useEffect } from "react";
import { Button, message, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { SetLoader } from "../../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts } from "../../../apicalls/products";
import { DeleteProduct } from "../../../apicalls/products";
import moment from "moment";
import Bids from "./Bids";

function Products() {
  const [showBids, setShowBids] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({
        seller: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            <i
              class="ri-delete-bin-5-line"
              onClick={() => {
                deleteProduct(record._id);
              }}
            ></i>
            <i
              class="ri-edit-line"
              onClick={() => {
                setSelectedProduct(record);
                setShowProductForm(true);
              }}
            ></i>

            <span
              className="underline cursor-pointer"
              onClick={() => {
                setSelectedProduct(record);
                setShowBids(true);
              }}
            >
              showBids
            </span>
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
      <div className="flex justify-end mb-2">
        <button
          type="default"
          onClick={() => {
            setSelectedProduct(null);
            setShowProductForm(true);
          }}
        >
          Add Product
        </button>
      </div>
      <Table columns={columns} dataSource={products} />
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
      {showBids && (
        <Bids
          showBidsModal={showBids}
          setShowBidsModal={setShowBids}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;
