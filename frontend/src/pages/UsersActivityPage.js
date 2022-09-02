import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, activities: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function UsersActivityPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [userFilter, setUserFilter] = useState('');

  const [{ loading, error, activities }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/activity/summary`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <div>
        <InputGroup className="filter">
          <FormControl
            type="text"
            size="lg"
            onChange={(e) => setUserFilter(e.target.value)}
            placeholder="Filter activities by user name..."
          ></FormControl>
        </InputGroup>
      </div>
      <br></br>
      <div>
        <h1>Login Activities</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            <table className="table table-dark table-bordered">
              <thead>
                <tr>
                  <th className="col4">Name</th>
                  <th className="col4">Email</th>
                  <th className="col4">Date</th>
                  <th className="col4">Time</th>
                </tr>
              </thead>
            </table>
            <div className="activity-table">
              <table className="table table-striped table-bordered">
                <tbody>
                  {activities
                    .filter(
                      (a) =>
                        a.activityType === 'login' &&
                        a.name
                          .toLowerCase()
                          .startsWith(userFilter.toLowerCase())
                    )
                    .map((activity) => (
                      <tr key={activity._id}>
                        <td className="col4">{activity.name}</td>
                        <td className="col4">{activity.email}</td>
                        <td className="col4">
                          {activity.createdAt.slice(0, 10)}
                        </td>
                        <td className="col4">
                          {activity.createdAt.slice(11, 19)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <div>
        <h1>Logout Activities</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            <table className="table table-dark table-bordered">
              <thead>
                <tr>
                  <th className="col4">Name</th>
                  <th className="col4">Email</th>
                  <th className="col4">Date</th>
                  <th className="col4">Time</th>
                </tr>
              </thead>
            </table>
            <div className="activity-table">
              <table className="table table-striped table-bordered">
                <tbody>
                  {activities
                    .filter(
                      (a) =>
                        a.activityType === 'logout' &&
                        a.name
                          .toLowerCase()
                          .startsWith(userFilter.toLowerCase())
                    )
                    .map((activity) => (
                      <tr key={activity._id}>
                        <td className="col4">{activity.name}</td>
                        <td className="col4">{activity.email}</td>
                        <td className="col4">
                          {activity.createdAt.slice(0, 10)}
                        </td>
                        <td className="col4">
                          {activity.createdAt.slice(11, 19)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <div>
        <h1>Add To Cart Activities</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            <table className="table table-bordered table-dark">
              <thead>
                <tr>
                  <th className="col5">Name</th>
                  <th className="col5">Email</th>
                  <th className="col4">Product (slug)</th>
                  <th className="col7">Price</th>
                  <th className="col7">Date</th>
                  <th className="col7">Time</th>
                </tr>
              </thead>
            </table>
            <div className="activity-table">
              <table className="table table-striped table-bordered">
                <tbody>
                  {activities
                    .filter(
                      (a) =>
                        a.activityType === 'addToCart' &&
                        a.name
                          .toLowerCase()
                          .startsWith(userFilter.toLowerCase())
                    )
                    .map((activity) => (
                      <tr key={activity._id}>
                        <td className="col5">{activity.name}</td>
                        <td className="col5">{activity.email}</td>
                        <td className="col4">{activity.slug}</td>
                        <td className="col7">{activity.price}</td>
                        <td className="col7">
                          {activity.createdAt.slice(0, 10)}
                        </td>
                        <td className="col7">
                          {activity.createdAt.slice(11, 19)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
