import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ReadMePage from './pages/ReadMePage';
import SearchBox from './components/SearchBox';
import SearchPage from './pages/SearchPage';
import { getError } from './utils';
import OrderPage from './pages/OrderPage';
import ProtectedRoute from './components/ProtectedRoute.js';
import AdminRoute from './components/AdminRoute';
import UsersActivityPage from './pages/UsersActivityPage';
import { CookiesProvider, useCookies } from 'react-cookie';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import CreateProductPage from './pages/CreateProductPage';
import { getProductsCategories, reportLogoutActivityToDB } from './persist.js';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [cookies, setCookie, removeCookie] = useCookies(['userInfo']);
  const reportLogoutActivity = async (name, email, token) => {
    try {
      const data = await reportLogoutActivityToDB(name, email, token);
      ctxDispatch({ type: 'USER_REPORT_LOGOUT' });
    } catch (err) {
      alert(getError(err));
    }
  };

  const logoutHandler = () => {
    reportLogoutActivity(userInfo.name, userInfo.email, userInfo.token);
    ctxDispatch({ type: 'USER_LOGOUT' });
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentInfo');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('checkoutItems');
    localStorage.removeItem('cartItems');
    setCookie('userInfo', { path: '/' });
    removeCookie('userInfo', { path: '/' });
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductsCategories();
        setCategories(data);
      } catch (err) {
        alert(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <CookiesProvider>
      <BrowserRouter>
        <div className="d-flex flex-column site-container">
          <header>
            <Navbar bg="dark" variant="dark" expand="lg">
              <Container>
                <LinkContainer to="/">
                  <Navbar.Brand>Shirt In A Box</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" />
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((acc, x) => acc + x.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={logoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/login">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin ? (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/useractivity">
                        <NavDropdown.Item>Users activity</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="/"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </Link>
                    </NavDropdown>
                  ) : !userInfo ? (
                    <Link className="nav-link" to="/login">
                      Log In
                    </Link>
                  ) : (
                    <NavDropdown title={userInfo.name} id="admin-nav-dropdown">
                      <Link
                        className="dropdown-item"
                        to="/"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </Link>
                    </NavDropdown>
                  )}
                </Nav>
              </Container>
            </Navbar>
          </header>
          <main>
            <Container className="mt-3">
              <Routes>
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/placeorder" element={<PlaceOrderPage />} />
                <Route path="/readme.html" element={<ReadMePage />} />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/orderhistory"
                  element={<OrderHistoryPage />}
                ></Route>
                <Route
                  path="/admin/useractivity"
                  element={
                    <AdminRoute>
                      <UsersActivityPage />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductListPage />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/product/:id"
                  element={
                    <AdminRoute>
                      <ProductEditPage />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/product/create"
                  element={
                    <AdminRoute>
                      <CreateProductPage />
                    </AdminRoute>
                  }
                ></Route>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Container>
          </main>
          <footer>
            <div className="text-center">All rights reserved</div>
          </footer>
        </div>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
