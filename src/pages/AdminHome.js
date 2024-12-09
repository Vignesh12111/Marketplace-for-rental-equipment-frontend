import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { Col, Row, Popconfirm, Button, Card, Typography, message } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function AdminHome() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalCars] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    setTotalCars(cars);
  }, [cars]);

  const handleDeleteCar = (carId) => {
    dispatch(deleteCar({ carid: carId }));
    message.success("Car deleted successfully!");
  };

  return (
    <DefaultLayout>
      {/* Header Section */}
      <Row justify="center" className="mt-4 mb-4">
        <Col lg={20} sm={24} className="d-flex justify-content-between align-items-center">
          <Title level={3}>Admin Panel</Title>
          <Link to="/addproduct">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Equiplnent
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Spinner for loading state */}
      {loading && <Spinner />}

      {/* Car Cards Section */}
      <Row justify="center" gutter={[16, 16]}>
        {totalCars.map((car) => (
          <Col lg={6} sm={12} xs={24} key={car._id}>
            <Card
              hoverable
              cover={
                <img
                  src={car.image}
                  alt={car.name}
                  style={{ height: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
              }
            >
              <div className="card-content">
                <Title level={5}>{car.name}</Title>
                <Text>Rent Per Hour: ₹{car.rentPerHour}</Text>
                <div className="d-flex justify-content-end mt-3">
                  <Link to={`/editproduct/${car._id}`}>
                    <Button type="text" icon={<EditOutlined />} style={{ color: "green" }} />
                  </Link>
                  <Popconfirm
                    title="Are you sure to delete this car?"
                    onConfirm={() => handleDeleteCar(car._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" icon={<DeleteOutlined />} style={{ color: "red" }} />
                  </Popconfirm>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
}

export default AdminHome;
