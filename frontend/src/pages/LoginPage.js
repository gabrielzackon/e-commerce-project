import Axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { getError } from '../utils';

export default function LoginPage() {
  const THIRTY_MINS_IN_MS = 30 * 60 * 1000;
  const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch: ctxDispatch } = useContext(Store);

  const userInfoObj = JSON.parse(localStorage.getItem('userInfo'));
  const userInfo =
    userInfoObj && userInfoObj['expiry'] <= new Date().getTime()
      ? userInfoObj
      : null;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/login', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      const now = new Date();
      const ttl = document.getElementById('remember-me').checked
        ? TEN_DAYS_IN_MS
        : THIRTY_MINS_IN_MS;
      data['expiry'] = now.getTime() + ttl;
      localStorage.setItem('userInfo', JSON.stringify(data));
      reportLoginActivity(data.name, data);
      navigate(redirect || '/');
    } catch (err) {
      alert(getError(err));
    }
  };

  const reportLoginActivity = async (name, userData) => {
    try {
      const { data } = await Axios.post(
        '/api/login/activity/report',
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
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
