import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentInfo },
  } = state;

  const [cardNumber, setCardNumber] = useState(paymentInfo.cardNumber || '');
  const [billingZip, setBillingZip] = useState(paymentInfo.billingZip || '');
  const [expiryDate, setExpiryDate] = useState(paymentInfo.expiryDate || '');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_PAYMENT_INFO',
      payload: {
        cardNumber,
        billingZip,
        expiryDate,
      },
    });
    localStorage.setItem(
      'paymentInfo',
      JSON.stringify({
        cardNumber,
        billingZip,
        expiryDate,
      })
    );
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment</title>
        </Helmet>
        <h1 className="my-3">Payment </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="card number">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="card number"
              required
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="zip">
            <Form.Label>Billing Zip</Form.Label>
            <Form.Control
              type="zip"
              required
              onChange={(e) => setBillingZip(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="month">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="month"
              min="2022-09"
              required
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
