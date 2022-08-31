import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems, checkoutItems },
  } = state;

  const updateQuantityHandler = async (cartItem, quantity) => {
    const { data } = await axios.get(`/api/products/${cartItem._id}`);

    if (data.countInStock < quantity) {
      window.alert('Product out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...cartItem, quantity },
    });

    const cartItemObj = document.querySelector(
      `input[type="checkbox"][id="${cartItem.slug}"]`
    );

    if (cartItemObj.checked) {
      ctxDispatch({
        type: 'CHECKOUT_ADD_ITEM',
        payload: { ...cartItem, quantity },
      });
    }
  };

  const checkoutCheckboxHandler = async (cartItem) => {
    const cartItemObj = document.querySelector(
      `input[type="checkbox"][id="${cartItem.slug}"]`
    );
    const actionType = cartItemObj.checked
      ? 'CHECKOUT_ADD_ITEM'
      : 'CHECKOUT_REMOVE_ITEM';

    ctxDispatch({
      type: actionType,
      payload: { ...cartItem },
    });
  };

  const deleteItemFromCarthandler = (cartItem) => {
    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: cartItem,
    });

    const cartItemObj = document.querySelector(
      `input[type="checkbox"][id="${cartItem.slug}"]`
    );

    if (cartItemObj.checked) {
      ctxDispatch({
        type: 'CHECKOUT_REMOVE_ITEM',
        payload: { ...cartItem },
      });
    }
  };

  const ProceedToCheckoutHandler = () => {
    navigate('/shipping');
  };

  useEffect(() => {
    if (
      !localStorage.getItem('userInfo') ||
      localStorage.getItem('userInfo')['expiry'] <= new Date().getTime()
    ) {
      navigate(`/login?redirect=/cart`);
    }
    localStorage.removeItem('checkoutItems');
    ctxDispatch({
      type: 'CHECKOUT_INITIAL',
    });
  }, [navigate]);

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Empty cart. <Link to="/"> Start shopping!</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateQuantityHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span id={item.slug}>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateQuantityHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={1}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => deleteItemFromCarthandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                    <Col md={1}>
                      <div>
                        <input
                          type="checkbox"
                          id={item.slug}
                          onChange={() => checkoutCheckboxHandler(item)}
                        />
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 id="subtotal">
                    Subtotal (
                    {checkoutItems.reduce((a, c) => a + c.quantity, 0)} items) :
                    $
                    {checkoutItems.reduce(
                      (a, c) => a + c.price * c.quantity,
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => ProceedToCheckoutHandler()}
                      disabled={checkoutItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
