import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { getError, THIRTY_MINS_IN_MS } from '../utils';
import { useCookies } from 'react-cookie';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cookies, setCookie] = useCookies(['userInfo']);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const reportLoginActivity = async (name, userData) => {
    try {
      const { data } = await Axios.post(
        '/api/activity/loginActivity',
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      const expiry = new Date();
      expiry.setTime(expiry.getTime() + THIRTY_MINS_IN_MS);
      data['expiry'] = expiry.getTime();
      localStorage.setItem('userInfo', JSON.stringify(data));
      reportLoginActivity(data.name, data);
      ctxDispatch({ type: 'SET_USER_CART', payload: [] });
      setCookie('userInfo', JSON.stringify(data), {
        path: '/',
        expires: expiry,
      });
      navigate(redirect || '/');
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
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            onInvalid={(e) => {
              e.target.setCustomValidity('Please enter valid email address');
            }}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`}>Log In</Link>
        </div>
      </Form>
    </Container>
  );
}
