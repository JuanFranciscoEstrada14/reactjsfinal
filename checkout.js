const checkoutForm = document.getElementById('checkout-form');
const customerInfoForm = document.getElementById('customer-info-form');

document.getElementById('comprar-btn').addEventListener('click', () => {
  checkoutForm.style.display = 'block';
});

customerInfoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;


  if (!name || !email || !address) {
    alert('Por favor, completa todos los campos del formulario.');
    return; 
  }



  alert(`¡Gracias, ${name}! Tu pedido se ha realizado con éxito.`);


  vaciarCarrito();
  checkoutForm.style.display = 'none';
});
