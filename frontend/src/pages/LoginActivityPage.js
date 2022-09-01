import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      console.log(action);
      return { ...state, activities: action.payload.loginData, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function LoginActivityPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, activities }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { loginData } = await axios.get(
          `/api/loginactivity`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const { logoutData } = await axios.get(
          `/api/loginactivity`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        console.log(loginData, logoutData);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { loginData: loginData, logoutData: logoutData },
        });
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
        <Helmet>
          <title>Login Activity</title>
        </Helmet>

        <h1>Login Activity</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.name}</td>
                  <td>{activity.email}</td>
                  <td>{activity.createdAt.slice(0, 10)}</td>
                  <td>{activity.createdAt.slice(11, 19)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <br></br>
      <div>
        <Helmet>
          <title>Logout Activity</title>
        </Helmet>

        <h1>Logout Activity</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.name}</td>
                  <td>{activity.email}</td>
                  <td>{activity.createdAt.slice(0, 10)}</td>
                  <td>{activity.createdAt.slice(11, 19)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
