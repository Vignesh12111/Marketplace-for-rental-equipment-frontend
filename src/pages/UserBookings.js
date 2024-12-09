import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import { Col, Row, Card, Typography, Image } from "antd";
import Spinner from "../components/Spinner";
import moment from "moment";

const { Title, Text } = Typography;

function UserBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <div style={{ padding: "20px" }}>
        <Title level={3} className="text-center">
          My Bookings
        </Title>

        <Row justify="center" gutter={[16, 16]}>
          {bookings
            .filter((o) => o.user === user._id)
            .map((booking) => (
              <Col lg={16} sm={24} key={booking._id}>
                <Card hoverable className="booking-card" style={{ borderRadius: "10px" }}>
                  <Row>
                    {/* Car Image */}
                    <Col lg={6} sm={24} className="d-flex justify-content-center">
                      <Image
                        src={booking.car.image}
                        alt={booking.car.name}
                        style={{ borderRadius: "10px", height: "140px", objectFit: "cover" }}
                        preview={false}
                      />
                    </Col>

                    {/* Booking Details */}
                    <Col lg={12} sm={24}>
                      <div style={{ padding: "10px" }}>
                        <Title level={5}>{booking.car.name}</Title>
                        <Text>Total Hours: <b>{booking.totalHours}</b></Text>
                        <br />
                        <Text>Rent Per Hour: <b>₹{booking.car.rentPerHour}</b></Text>
                        <br />
                        <Text>Total Amount: <b>₹{booking.totalAmount}</b></Text>
                        <br />
                        <Text>Transaction ID: <b>{booking.transactionId}</b></Text>
                        <br />
                        <Text>
                          Booking Date:{" "}
                          <b>{moment(booking.createdAt).format("MMM DD yyyy")}</b>
                        </Text>
                      </div>
                    </Col>

                    {/* Booking Time Slots */}
                    <Col lg={6} sm={24} className="d-flex flex-column align-items-end">
                      <Text>
                        From: <b>{moment(booking.bookedTimeSlots.from).format("MMM DD yyyy HH:mm")}</b>
                      </Text>
                      <Text>
                        To: <b>{moment(booking.bookedTimeSlots.to).format("MMM DD yyyy HH:mm")}</b>
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
    </DefaultLayout>
  );
}

export default UserBookings;
