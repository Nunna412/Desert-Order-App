
import './App.css';
import './styles.css';
import { useEffect, useState } from 'react';

function App() {
  const[products,setProducts]=useState([]);
  const[cart,setCart]=useState([]);
  const[showConfirmation,setShowConfirmation]=useState(false);

  useEffect(()=>{
    fetch("data.json")
    .then((response)=>response.json())
    .then((data)=>setProducts(data));
  },[]);
  const addToCart = (item)=>{
    const exists = cart.find((x)=> x.name === item.name);
    if(exists){
      setCart(
        cart.map((x)=> x.name === item.name ? {...x,qty:x.qty+1}:x)
      );
    }else{
      setCart([...cart,{...item,qty:1}]);
    }
  }
  const incrementQty = (item)=>{
    setCart(cart.map((x)=> x.name === item.name ? {...x, qty: x.qty+1}:x));
  };
  const decrementQty = (item) => {
    const exists = cart.find((x) => x.name === item.name);
    if (exists.qty === 1) {
      setCart(cart.filter((x) => x.name !== item.name));
    } else {
      setCart(
        cart.map((x) =>
          x.name === item.name ? { ...x, qty: x.qty - 1 } : x
        )
      );
    }
  };

  const removeFromCart = (name)=>{
    setCart(cart.filter((x)=>x.name !== name));
  };

  const getTotal = () => {
    return cart.reduce((total,item)=> total+ item.price* item.qty , 0).toFixed(2);
  };

   const getQty = (name) => {
    const item = cart.find((x) => x.name === name);
    return item ? item.qty : 0;
  };
   const confirmOrder = () => {
    setShowConfirmation(true);
  };

  const startNewOrder = () => {
    setCart([]);
    setShowConfirmation(false);
  };

  return (
      <div className="container">
      <div className="menu">
        <h1 className="heading">Desserts</h1>
        <div className="grid">
          {products.map((item, i) => {
            const qty = getQty(item.name);
            return (
              <div
                className={`card ${qty > 0 ? 'active' : ''}`}
                key={i}
              >
                <div className="img-wrapper">
                  <img
                    src={item.image.desktop}
                    alt={item.name}
                    className={`dessert-img ${qty > 0 ? 'active' : ''}`}
                  />
                  {qty === 0 ? (
                    <button className="add-btn" onClick={() => addToCart(item)}>
                      <span className="cart-icon"><img src="images/icon-add-to-cart.svg" alt="cart"></img></span> Add to Cart
                    </button>
                  ) : (
                    <div className="qty-controls">
                      <button onClick={() => decrementQty(item)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => incrementQty(item)}>+</button>
                    </div>
                  )}
                </div>
                <div className="desc">
                  <p className="category">{item.category}</p>
                  <h3 className="name">{item.name}</h3>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='cart'>
        <h2>Your Cart ({cart.reduce((sum,item)=>sum+item.qty,0)})</h2>
        {cart.length === 0 ? (
          <div className='empty-cart'>
            <img src="images/illustration-empty-cart.svg" alt="Empty Cart"></img>
            <p>Your added items will appear here</p>
          </div>
        ):(
          <>
        <ul>
          {cart.map((item,i)=>(
            <li key={i} className='cart-item'>
              <div>
                <span>{item.name}</span>
                <span>{item.qty}x</span>
              </div>
              <div>
                <span>${(item.price * item.qty).toFixed(2)}</span>
                <button className='remove-btn'onClick={()=> removeFromCart(item.name)}><img src="images/icon-remove-item.svg" alt="remove"></img></button>
              </div>
            </li>
          ))}
        </ul>
        <div className='total'>
          <p>Order Total</p>
          <h3>${getTotal()}</h3>
        </div>
        <div className='delivery-note'>
          <span><img src="images/icon-carbon-neutral.svg" alt="carbon icon"></img>This is a carbon-neutral delivery</span>
        </div>
        <button className='confirm-btn' onClick={confirmOrder}>Confirm Order</button>
        </>
        )}
      </div>
      {showConfirmation && (
        <div className="order-confirm-modal">
          <div className="modal-content">
            <div className="modal-header">
              <img src="images/icon-order-confirmed.svg" alt="success" />
              <h2>Order Confirmed</h2>
              <p>We hope you enjoy your food!</p>
            </div>
            <div className="modal-items">
              {cart.map((item, i) => (
                <div className="modal-item" key={i}>
                  <img src={item.image.thumbnail} alt={item.name} />
                  <div className="modal-details">
                    <strong>{item.name}</strong>
                    <div className="qty-price">{item.qty}x @ ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="modal-price">
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-total">
              <p>Order Total</p>
              <h3>${getTotal()}</h3>
            </div>
            <button className="start-btn" onClick={startNewOrder}>
              Start New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
