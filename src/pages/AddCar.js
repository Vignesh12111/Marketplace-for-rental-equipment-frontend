import { Col, Row, Form, Input, Card, Button, Typography } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { addCar } from "../redux/actions/carsActions";

const { Title } = Typography;

function AddEquipment() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  function onFinish(values) {
    values.bookedTimeSlots = [];
    dispatch(addCar(values));
    console.log(values);
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center" style={{ marginTop: "5rem" }}>
        <Col lg={12} sm={24} xs={24}>
          <Card
            hoverable
            style={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
              Add New Rental Equipment
            </Title>
            <Form
              layout="vertical"
              onFinish={onFinish}
              style={{ marginTop: "20px" }}
            >
              <Form.Item
                name="name"
                label="Equipment Name"
                rules={[{ required: true, message: "Please enter the equipment name" }]}
              >
                <Input placeholder="Enter the name of the equipment" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please enter the image URL" }]}
              >
                <Input placeholder="Enter the image URL of the equipment" />
              </Form.Item>
              <Form.Item
                name="rentPerHour"
                label="Rent Per Hour"
                rules={[{ required: true, message: "Please enter the rent per hour" }]}
              >
                <Input type="number" placeholder="Enter the rental price per hour" />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="RentalEquipment Count "
                rules={[{ required: true, message: "Please enter the RentalEquipment Count" }]}
              >
                <Input placeholder="Enter the capacity or load it can handle" />
              </Form.Item>
              <Form.Item
                name="fuelType"
                label="Equipment Condition"
                rules={[{ required: true, message: "Please enter the equipment condition" }]}
              >
                <Input placeholder="Enter the condition of the equipment" />
              </Form.Item>
              <Form.Item
                name="rentalEquipment"
                label="Rental Equipment"
                rules={[{ required: true, message: "Please enter the rental equipment details" }]}
              >
                <Input placeholder="Enter the rental equipment details" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  padding: "10px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                Add Equipment
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default AddEquipment;
