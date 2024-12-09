import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { getAllCars } from '../redux/actions/carsActions';
import { Col, Row, Divider, DatePicker, Checkbox, Input } from 'antd';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Fuse from 'fuse.js';

const { RangePicker } = DatePicker;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalcars(cars);
    setFilteredCars(cars);
  }, [cars]);

  function setFilter(values) {
    var selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm');
    var selectedTo = moment(values[1], 'MMM DD yyyy HH:mm');

    var temp = [];

    for (var car of cars) {
      if (car.bookedTimeSlots.length == 0) {
        temp.push(car);
      } else {
        for (var booking of car.bookedTimeSlots) {
          if (
            selectedFrom.isBetween(booking.from, booking.to) ||
            selectedTo.isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.to).isBetween(selectedFrom, selectedTo)
          ) {
          } else {
            temp.push(car);
          }
        }
      }
    }

    setTotalcars(temp);
    filterCars(temp);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    filterCars(totalCars, query, minRent, maxRent);
  }

  function handleRentFilter(min, max) {
    setMinRent(min);
    setMaxRent(max);
    filterCars(totalCars, searchQuery, min, max);
  }

  function filterCars(carsToFilter, query = '', min = '', max = '') {
    let filtered = carsToFilter;

    // Filter by rent
    if (min || max) {
      filtered = filtered.filter(
        (car) =>
          (!min || car.rentPerHour >= min) && (!max || car.rentPerHour <= max)
      );
    }

    // Search by car name using fuse.js
    if (query) {
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        threshold: 0.3,
      });
      filtered = fuse.search(query).map((result) => result.item);
    }

    setFilteredCars(filtered);
  }

  return (
    <DefaultLayout>
      <Row className="mt-3" justify="center">
        <Col lg={20} sm={24} className="d-flex justify-content-left">
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="MMM DD yyyy HH:mm"
            onChange={setFilter}
          />
        </Col>
        <Col lg={20} sm={24} className="d-flex justify-content-left mt-3">
          <Input
            placeholder="Search by car name"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col lg={20} sm={24} className="d-flex justify-content-left mt-3">
          <div>
            <label>Min Rent: </label>
            <input
              type="number"
              value={minRent}
              onChange={(e) => handleRentFilter(e.target.value, maxRent)}
            />
            <label> Max Rent: </label>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => handleRentFilter(minRent, e.target.value)}
            />
          </div>
        </Col>
      </Row>

      {loading && <Spinner />}

      <Row justify="center" gutter={16}>
        {filteredCars.map((car) => {
          return (
            <Col lg={5} sm={24} xs={24} key={car._id}>
              <div className="car p-2 bs1">
                <img src={car.image} className="carimg" alt={car.name} />

                <div className="car-content d-flex align-items-center justify-content-between">
                  <div className="text-left pl-2">
                    <p>{car.name}</p>
                    <p> Rent Per Hour {car.rentPerHour} /-</p>
                  </div>

                  <div>
                    <button className="btn1 mr-2">
                      <Link to={`/booking/${car._id}`}>Book Now</Link>
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </DefaultLayout>
  );
}

export default Home;
