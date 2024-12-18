import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {  useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { bookCar } from "../redux/actions/bookingActions";
import { DatePicker, Row, Col, Divider, Checkbox, Modal, Card, Typography, Button } from "antd";
import StripeCheckout from "react-stripe-checkout";
import moment from "moment";
import AOS from "aos";

import "aos/dist/aos.css"; // AOS animations CSS
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function BookingEquipment() {
  const { id } = useParams(); // Extract equipment ID from the route
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setDriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init(); // Initialize AOS animations
  }, []);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true);
        const response = await axios.get(`https://marketplace-for-rental-equipment-backend.onrender.com/api/cars/getcarbyid/${id}`);
        setEquipment(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching equipment data:", error);
        setLoading(false);
      }
    }
    fetchEquipment();
  }, [id]);

  useEffect(() => {
    let amount = totalHours * (equipment?.rentPerHour || 0); // Calculate rent based on total hours
    if (driver) {
      amount += 30 * totalHours; // Add driver charges if applicable
    }
    setTotalAmount(amount);
  }, [driver, totalHours, equipment?.rentPerHour]);

  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));
    setTotalHours(values[1].diff(values[0], "hours")); // Calculate total hours
  }

  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      equipment: equipment._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };
    dispatch(bookCar(reqObj)); // Dispatch booking action for the equipment
  }

  if (loading || !equipment) {
    return <Spinner />;
  }

  return (
    <DefaultLayout>
      <Row justify="center" style={{ minHeight: "90vh", padding: "20px" }}>
        <Col lg={10} sm={24} xs={24} className="p-3">
          <Card hoverable cover={<img src={equipment.image} alt="Equipment" style={{ borderRadius: "10px" }} />}>
            <Title level={4} style={{ textAlign: "center" }}>
              {equipment.name}
            </Title>
            <Divider />
            <Text>
              <b>Rent Per Hour:</b> {equipment.rentPerHour} /-
            </Text>
            <br />
            <Text>
              <b>Condition Details</b> {equipment.fuelType}
            </Text>
            <br />
            <Text>
              <b>Max RentalEquipment Count:</b> {equipment.capacity} Count
            </Text>
          </Card>
        </Col>

        <Col lg={10} sm={24} xs={24} className="p-3">
          <Card>
            <Title level={4} style={{ textAlign: "center" }}>
              Book Equipment
            </Title>
            <Divider type="horizontal" />
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="MMM DD yyyy HH:mm"
              onChange={selectTimeSlots}
              style={{ width: "100%" }}
            />
            <Button
              type="primary"
              className="mt-3 w-100"
              onClick={() => {
                setShowModal(true);
              }}
            >
              View Booked Slots
            </Button>

            {from && to && (
              <div className="mt-4">
                <Text>
                  <b>Total Hours:</b> {totalHours}
                </Text>
                <br />
                <Text>
                  <b>Rent Per Hour:</b> {equipment.rentPerHour}
                </Text>
                <br />
                <Checkbox
                  onChange={(e) => {
                    setDriver(e.target.checked);
                  }}
                >
                  fast delivery required (₹30)
                </Checkbox>
                <Title level={4} className="mt-2">
                  Total Amount: ₹{totalAmount}
                </Title>

                <StripeCheckout
                  shippingAddress
                  token={onToken}
                  currency="inr"
                  amount={totalAmount * 100}
                  stripeKey="pk_test_51NFtVGSAZAXtdYSkpJntFLfuU3dQNlk1BVqldJWCWQUyDqAtoE1wHVhRCB2GEnGurggdZOd1L08afXnaMN0H7qcO00yUPQevQp"
                >
                  <Button type="primary" className="w-100 mt-2">
                    Book Now
                  </Button>
                </StripeCheckout>
              </div>
            )}
          </Card>
        </Col>

        {equipment.bookedTimeSlots?.length > 0 && (
          <Modal
            open={showModal}
            footer={null}
            onCancel={() => setShowModal(false)}
            title="Booked Time Slots"
          >
            {equipment.bookedTimeSlots.map((slot, index) => (
              <Card key={index} className="mb-2">
                {slot.from} - {slot.to}
              </Card>
            ))}
          </Modal>
        )}
      </Row>
    </DefaultLayout>
  );
}

export default BookingEquipment;
