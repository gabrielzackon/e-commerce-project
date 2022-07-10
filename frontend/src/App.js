import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">Football Shirts</a>
      </header>
      <main>
        <h1>Featured products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">{product.price}$</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
