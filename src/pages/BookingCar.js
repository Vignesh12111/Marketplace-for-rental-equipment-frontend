import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import { bookCar } from "../redux/actions/bookingActions";
import { DatePicker, Row, Col, Divider, Checkbox, Modal } from "antd";
import StripeCheckout from "react-stripe-checkout";
import moment from "moment";
import AOS from "aos";

import "aos/dist/aos.css"; // AOS animations CSS
const { RangePicker } = DatePicker;

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
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24} className="p-3">
          <img
            src={equipment.image}
            className="equipment-img bs1 w-100"
            data-aos="flip-left"
            data-aos-duration="1500"
            alt="Equipment"
          />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" dashed>
            Equipment Details
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p><strong>{equipment.name}</strong></p>
            <p>Rent Per Hour: <b>{equipment.rentPerHour}</b> /-</p>
            <p>Fuel Type: {equipment.fuelType}</p>
            <p>Max Capacity: {equipment.capacity} persons</p>
          </div>

          <Divider type="horizontal" dashed>
            Select Time Slots
          </Divider>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD yyyy HH:mm"
            onChange={selectTimeSlots}
          />
          <br />
          <button
            className="btn1 mt-2"
            onClick={() => {
              setShowModal(true);
            }}
          >
            View Booked Slots
          </button>

          {from && to && (
            <div>
              <p>
                Total Hours: <b>{totalHours}</b>
              </p>
              <p>
                Rent Per Hour: <b>{equipment.rentPerHour}</b>
              </p>
              <Checkbox
                onChange={(e) => {
                  setDriver(e.target.checked);
                }}
              >
                Driver Required
              </Checkbox>

              <h3>Total Amount: {totalAmount}</h3>

              <StripeCheckout
                shippingAddress
                token={onToken}
                currency="inr"
                amount={totalAmount * 100}
                stripeKey="pk_test_51NFtVGSAZAXtdYSkpJntFLfuU3dQNlk1BVqldJWCWQUyDqAtoE1wHVhRCB2GEnGurggdZOd1L08afXnaMN0H7qcO00yUPQevQp"
              >
                <button className="btn1">Book Now</button>
              </StripeCheckout>
            </div>
          )}
        </Col>

        {equipment.bookedTimeSlots?.length > 0 && (
          <Modal
            visible={showModal}
            closable={false}
            footer={false}
            title="Booked Time Slots"
          >
            <div className="p-2">
              {equipment.bookedTimeSlots.map((slot, index) => (
                <button key={index} className="btn1 mt-2">
                  {slot.from} - {slot.to}
                </button>
              ))}
              <div className="text-right mt-5">
                <button
                  className="btn1"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Row>
    </DefaultLayout>
  );
}

export default BookingEquipment;
