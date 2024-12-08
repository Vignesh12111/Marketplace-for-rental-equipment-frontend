import { Col, Row, Form, Input } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import Spinner from '../components/Spinner';
import { addCar } from '../redux/actions/carsActions';

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
      <Row justify="center" style={{ marginTop: '5rem' }}>
        <Col lg={12} sm={24} xs={24} className="p-4">
          <Form className="bs1 p-4" layout="vertical" onFinish={onFinish}>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add New Rental Equipment</h3>
            <hr />
            <Form.Item name="name" label="Equipment Name" rules={[{ required: true }]}>
              <Input placeholder="Enter the name of the equipment" />
            </Form.Item>
            <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
              <Input placeholder="Enter the image URL of the equipment" />
            </Form.Item>
            <Form.Item name="rentPerHour" label="Rent Per Hour" rules={[{ required: true }]}>
              <Input placeholder="Enter the rental price per hour" />
            </Form.Item>
            <Form.Item name="capacity" label="Capacity/Load" rules={[{ required: true }]}>
              <Input placeholder="Enter the capacity or load it can handle" />
            </Form.Item>
            <Form.Item name="fuelType" label="Fuel Type" rules={[{ required: true }]}>
              <Input placeholder="Enter the fuel type (if applicable)" />
            </Form.Item>

            <div className="text-right">
              <button
                className="btn1"
                style={{
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ADD EQUIPMENT
              </button>
            </div>
          </Form>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default AddEquipment;
