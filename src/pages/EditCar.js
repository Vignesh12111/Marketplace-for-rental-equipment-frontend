import { Col, Row, Form, Input, Button, Typography, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { editCar, getAllCars } from "../redux/actions/carsActions";
import { useParams } from "react-router-dom";

const { Title } = Typography;

function EditEquipment() {
  const { id } = useParams();
  const { cars } = useSelector((state) => state.carsReducer);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCarData = async () => {
      try {
        const response = await fetch(
          `https://marketplace-for-rental-equipment-backend.onrender.com/api/cars/getcarbyid/${id}`
        );
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [id]);

  function onFinish(values) {
    values._id = equipment._id;
    dispatch(editCar(values));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center" style={{ marginTop: "4rem", padding: "0 20px" }}>
        <Col lg={12} sm={24} xs={24}>
          {equipment ? (
            <Form
              initialValues={equipment}
              layout="vertical"
              onFinish={onFinish}
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "24px",
                background: "#fff",
              }}
            >
              <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                Edit Rental Equipment
              </Title>
              <Divider />
              <Form.Item
                name="name"
                label="Equipment Name"
                rules={[{ required: true, message: "Please enter the equipment name" }]}
              >
                <Input placeholder="Enter the equipment name" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please provide an image URL" }]}
              >
                <Input placeholder="Enter the image URL" />
              </Form.Item>
              <Form.Item
                name="rentPerHour"
                label="Rent Per Hour"
                rules={[{ required: true, message: "Please enter the rent per hour" }]}
              >
                <Input type="number" placeholder="Enter the rent per hour" />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="RentalEquipment Count"
                rules={[{ required: true, message: "Please enter the RentalEquipment Count" }]}
              >
                <Input placeholder="Enter the capacity or load" />
              </Form.Item>
              <Form.Item
                name="fuelType"
                label="Equipment Condition"
                rules={[{ required: true, message: "Please enter the equipment condition" }]}
              >
                <Input placeholder="Enter the condition of the equipment" />
              </Form.Item>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Update Equipment
                </Button>
              </div>
            </Form>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              Loading equipment data...
            </div>
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default EditEquipment;
