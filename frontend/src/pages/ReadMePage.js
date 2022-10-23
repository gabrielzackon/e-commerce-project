import React from 'react';

export default function ReadMePage() {
  return (
    <section id="home">
      <div class="container" id="home-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div>
          <h1 id="question" class="readme text">
            {' '}
            Store name - <span class="readme">Shirt In A Box</span>
          </h1>
          <h1 id="question" class="readme text">
            What are you selling?
            <br></br>
            <span class="readme">Football Team's Game Shirts </span>
          </h1>
          <h1 id="question" class="readme text">
            What additional pages did you add? How to operate it?
            <br></br>
            <span class="readme">
              <strong>Product Page</strong> - Enter by pressing on any product
            </span>
            <br></br>
            <span class="readme">
              <strong>Shipping Page</strong> - Fill in the form
            </span>
            <br></br>
            <span class="readme">
              <strong>Payment Page</strong> - Fill in the form
            </span>
            <br></br>
            <span class="readme">
              <strong>Search Page</strong> - Enter by typing in the search bar
              located at the top navbar, use any filter from the left menu
            </span>
            <br></br>
            <span class="readme">
              <strong>Review Order Page</strong> - After placing an order, you
              will get to the review order page.
            </span>
            <br></br>
            <span class="readme">
              <strong>Order History Page</strong> - Evert user has his order
              history summed, enter it by pressing on the user name that is
              located at the right of the top navbar, and the pressing on order
              history.
            </span>
          </h1>
          <br></br>
          <h1 id="question" class="readme text">
            What was hard to do?
            <br></br>
            <span class="readme">
              Working with new lanuages and frameworks, linking the backend and
              frontend every step of the way.{' '}
            </span>
          </h1>
          <br></br>
          <h1 id="question" class="readme text">
            Who is your partner?
            <br></br>
            <span class="readme"> Or Zachchinsky - 308557883 </span>
          </h1>
          <br></br>
          <h1 id="question" class="readme text">
            What did I do?
            <br></br>
            <span class="readme">
              Together with my partner we built the infrastructure of the code,
              then I focused on implementing the parts that regard to the
              products and the orders, then we worked together on the admin
              page.{' '}
            </span>
          </h1>
          <br></br>
          <h1 id="question" class="readme text">
            What did my partner do?
            <br></br>
            <span class="readme">
              Together with my partner we built the infrastructure of the code,
              then he focused on implementing the parts that regard to the
              users, the home page and the cart, then we worked together on the
              admin page.{' '}
            </span>
          </h1>
          <br></br>
          <h1 id="question" class="readme text">
            The different routes our app supports:
            <br></br>
            <strong>
              <span class="readme">User Routes - </span>
            </strong>
            <span class="readme">
              "/product/:slug", "/cart", "/search, "/login", "/signup",
              "/shipping", "/payment", "/placeorder", "/order/:id",
              "/readme.html", "/"
            </span>
            <br></br>
            <strong>
              <span class="readme">Admin Routes - </span>
            </strong>
            <span class="readme">
              "/admin/useractivity","/admin/products", "/admin/product/:id",
              "/admin/product/create",
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
