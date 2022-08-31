import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
import { reportATCActivity } from '../utils';

function Product(props) {
  const navigate = useNavigate();
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const userInfoObj = JSON.parse(localStorage.getItem('userInfo'));
  const userInfo =
    userInfoObj && userInfoObj['expiry'] >= new Date().getTime()
      ? userInfoObj
      : null;

  const addToCartHandler = async (item) => {
    if (!userInfo) {
      navigate(`/login`);
    } else {
      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      const { data } = await axios.get(`/api/products/${item._id}`);

      if (data.countInStock < quantity) {
        window.alert('Product out of stock');
        return;
      }

      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });

      reportATCActivity(
        state.userInfo.name,
        state.userInfo.email,
        data,
        state.userInfo.token
      );
    }
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
