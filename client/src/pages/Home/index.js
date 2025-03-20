import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetProducts } from "../../apicalls/products";
import { Divider, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

function Home() {
  const [showFilters, setShowFilters] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: "approved",
    category: [],
    age: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <input
            type="text"
            placeholder="Search Products  here..."
            className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
          />
        </div>
        <div
          className={`
        grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}
      `}
        >
          {products?.map((products) => {
            return (
              <div
                className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer"
                key={products._id}
                onClick={() => navigate(`/product/${products._id}`)}
              >
                <img
                  src={products.images[0]}
                  className="w-full h-52 p-2 rounded-md "
                  alt=""
                />

                <div className="px-1 flex flex-col">
                  <h1 className="text-lg font-semibold">{products.name}</h1>
                  <p className="text-sm">{products.description} </p>
                  <Divider />
                  <span className="text-xl font-semibold text-green-700">
                    $ {products.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
