import Axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { getError } from '../utils';
import { useCookies } from 'react-cookie';

export default function LoginPage() {
  const THIRTY_MINS_IN_MS = 30 * 60 * 1000;
  const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
  const [cookies, setCookie] = useCookies(['userInfo']);

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch: ctxDispatch } = useContext(Store);

  const userInfo = cookies['userInfo'];

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/login', {
        email,
        password,
      });

      ctxDispatch({
        type: 'USER_LOGIN',
        payload: data,
      });
      const expiry = new Date();
      const ttl = document.getElementById('remember-me').checked
        ? TEN_DAYS_IN_MS
        : THIRTY_MINS_IN_MS;
      expiry.setTime(expiry.getTime() + ttl);
      data['expiry'] = expiry.getTime();
      localStorage.setItem('userInfo', JSON.stringify(data));
      reportLoginActivity(data.name, data);
      setUserCart(email, data.token);
      setCookie('userInfo', JSON.stringify(data), {
        path: '/',
        expires: expiry,
      });
      navigate(redirect || '/');
    } catch (err) {
      alert(getError(err));
    }
  };

  const setUserCart = async (email, token) => {
    try {
      const cartData = await Axios.get(`/api/carts/${email}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      ctxDispatch({ type: 'SET_USER_CART', payload: cartData.data });
    } catch (err) {
      alert(getError(err));
    }
  };

  const reportLoginActivity = async (name, userData) => {
    try {
      const { data } = await Axios.post(
        '/api/loginActivity/report',
        {
          name,
          email,
        },
        {
          headers: {
            authorization: `Bearer ${userData.token}`,
          },
        }
      );
      ctxDispatch({ type: 'USER_REPORT_LOGIN', payload: userData });
    } catch (err) {
      alert(getError(err));
    }
  };

  useEffect(() => {
    console.log('a');
    if (cookies['userInfo']) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Log In</title>
      </Helmet>
      <h1 className="my-3">Log In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div>
          <label>
            <input type="checkbox" id="remember-me" />
            Remember Me!
          </label>
        </div>
        <div className="mb-3">
          <Button type="submit">Log In</Button>
        </div>
        <div className="mb-3">
          Didn't register yet?{' '}
          <Link to={`/signup?redirect=${redirect}`}>
            Create your account here!
          </Link>
        </div>
      </Form>
    </Container>
  );
}
