import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import { Col, Row, DatePicker, Input, Card, Button, Typography, Slider } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import Fuse from "fuse.js";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  function setFilter(values) {
    const selectedFrom = moment(values[0], "MMM DD yyyy HH:mm");
    const selectedTo = moment(values[1], "MMM DD yyyy HH:mm");

    const filtered = cars.filter((car) => {
      return car.bookedTimeSlots.every((booking) => {
        const bookingFrom = moment(booking.from);
        const bookingTo = moment(booking.to);
        return (
          !selectedFrom.isBetween(bookingFrom, bookingTo) &&
          !selectedTo.isBetween(bookingFrom, bookingTo) &&
          !bookingFrom.isBetween(selectedFrom, selectedTo) &&
          !bookingTo.isBetween(selectedFrom, selectedTo)
        );
      });
    });

    setFilteredCars(filtered);
  }

  function handleSearch(query) {
    setSearchQuery(query);

    const fuse = new Fuse(cars, {
      keys: ["name"],
      threshold: 0.3,
    });

    const results = query ? fuse.search(query).map((result) => result.item) : cars;
    setFilteredCars(results.filter((car) => car.rentPerHour >= priceRange[0] && car.rentPerHour <= priceRange[1]));
  }

  function handlePriceFilter(range) {
    setPriceRange(range);
    setFilteredCars(
      cars.filter(
        (car) =>
          car.rentPerHour >= range[0] &&
          car.rentPerHour <= range[1] &&
          car.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        {/* Filter Section */}
        <Row gutter={16} className="mb-4">
          <Col lg={8} sm={24}>
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="MMM DD yyyy HH:mm"
              onChange={setFilter}
              style={{ width: "100%" }}
            />
          </Col>
          <Col lg={8} sm={24}>
            <Input
              placeholder="Search by Rental Equipment name"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col lg={8} sm={24}>
            <div>
              <Text>Filter by Rent (₹):</Text>
              <Slider
                range
                min={0}
                max={500}
                step={10}
                defaultValue={priceRange}
                onChange={handlePriceFilter}
              />
              <Text>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </Text>
            </div>
          </Col>
        </Row>

        {loading && <Spinner />}

        {/* Car Cards Section */}
        <Row gutter={[16, 16]}>
          {filteredCars.map((car) => (
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
                <Title level={5}>{car.name}</Title>
                <Text>Rent Per Hour: ₹{car.rentPerHour}</Text>
                <br />
                <Button type="primary" className="mt-2">
                  <Link to={`/booking/${car._id}`}>Book Now</Link>
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </DefaultLayout>
  );
}

export default Home;
