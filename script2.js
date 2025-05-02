function getStatusText(stage) {
  switch(stage) {
    case 0: return 'Assigning Material';
    case 1: return 'Printing in progress';
    case 2: return 'Tailoring in progress';
    case 3: return 'Finishing';
    case 4: return 'Ready for you';
    default: return 'In progress';
  }
}

const params = new URLSearchParams(window.location.search);
const orderID = params.get('ID');
const container = document.getElementById('orderList');

if (orderID) {
  const firebaseURL = 'https://firebasestorage.googleapis.com/test1-1e3d0.appspot.com/orders/${orderID}.json';

  fetch(firebaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ${response.status}');
      }
      return response.json();
    })
    .then(orderData => {
      if (typeof orderData === 'object' && orderData !== null) {
        Object.entries(orderData).forEach(([name, stage]) => {
          const anchor = document.createElement('a');
          anchor.className = 'order-card';
          anchor.href = `progress.html?step=4&stage=${stage}`;

          const nameDiv = document.createElement('div');
          nameDiv.className = 'product-name';
          nameDiv.textContent = name;

          const statusDiv = document.createElement('div');
          statusDiv.className = 'order-status';
          statusDiv.textContent = getStatusText(stage);

          anchor.appendChild(nameDiv);
          anchor.appendChild(statusDiv);
          container.appendChild(anchor);
        });
      }
    })
    .catch(error => {
      console.error('Failed to load order data:', error);
      container.textContent = 'Failed to load your order details.';
      container.style.color = 'white'; // To show error text in white
    });
} else {
  container.textContent = 'No order ID provided in URL.';
  container.style.color = 'white';
}

