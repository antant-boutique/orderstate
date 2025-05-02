const params = new URLSearchParams(window.location.search);
const orderID = params.get('ID');
const container = document.getElementById('orderList');

function getStatusText(stage) {
  switch(stage) {
    case 0: return 'Assigning material';
    case 1: return 'Printing in progress';
    case 2: return 'Tailoring in progress';
    case 3: return 'Finishing';
    case 4: return 'Ready for you';
    default: return 'In progress';
  }
}

if (orderID) {
  const firebaseURL = `https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT_ID/o/${orderID}.json?alt=media`;

  fetch(firebaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(orders => {
      if (Array.isArray(orders)) {
        orders.forEach(order => {
          const anchor = document.createElement('a');
          anchor.className = 'order-card';
          anchor.href = `progress.html?orderId=${order.id}&step=${4}&${order.stage}`;

          const nameDiv = document.createElement('div');
          nameDiv.className = 'product-name';
          nameDiv.textContent = order.name;

          const statusDiv = document.createElement('div');
          statusDiv.className = 'order-status';
          statusDiv.textContent = getStatusText(order.stage);

          anchor.appendChild(nameDiv);
          anchor.appendChild(statusDiv);
          container.appendChild(anchor);
        });
      }
    })
    .catch(error => {
      console.error('Failed to load order data:', error);
      container.textContent = 'Failed to load your order details.';
      container.style.color = 'white';
    });
} else {
  container.textContent = 'No order ID provided in URL.';
  container.style.color = 'white';
}

