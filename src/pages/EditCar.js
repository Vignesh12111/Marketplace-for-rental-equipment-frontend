import { Col, Row, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { editCar, getAllCars } from "../redux/actions/carsActions";
import { useParams } from "react-router-dom"; // Import useParams to get the id

function EditEquipment() {
  const { id } = useParams(); // Get the id from the URL params
  const { cars } = useSelector((state) => state.carsReducer);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [equipment, setEquipment] = useState(null);

  // Fetch equipment by id when the component mounts
  useEffect(() => {
    if (!id) return; // Don't fetch if id is not available

    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/getcarbyid/${id}`);
        const data = await response.json();
        setEquipment(data); // Set the fetched car data to equipment
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [id]);

  // Handle form submission to update car data
  function onFinish(values) {
    values._id = equipment._id;
    dispatch(editCar(values)); // Dispatch editCar action with updated values
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center" style={{ marginTop: "5rem" }}>
        <Col lg={12} sm={24} xs={24} className="p-4">
          {equipment ? (
            <Form
              initialValues={equipment}
              className="bs1 p-4"
              layout="vertical"
              onFinish={onFinish}
            >
              <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>
                Edit Rental Equipment
              </h3>
              <hr />
              <Form.Item
                name="name"
                label="Equipment Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter the equipment name" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter the image URL of the equipment" />
              </Form.Item>
              <Form.Item
                name="rentPerHour"
                label="Rent Per Hour"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter the rental price per hour" />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="Capacity/Load"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter the capacity or load it can handle" />
              </Form.Item>
              <Form.Item
                name="fuelType"
                label="Fuel Type"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter the fuel type (if applicable)" />
              </Form.Item>

              <div className="text-right">
                <button
                  className="btn1"
                  style={{
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Update Equipment
                </button>
              </div>
            </Form>
          ) : (
            <div>Loading equipment data...</div> // Loading message if equipment is not available
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default EditEquipment;
