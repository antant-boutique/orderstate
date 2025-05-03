function getStatusText(stage) {
  switch(stage) {
    case 0: return 'Order received';
    case 1: return 'Fabric assigned';
    case 2: return 'Artwork complete';
    case 3: return 'Tailoring done';
    case 4: return 'Ready for you';
    default: return 'In progress';
  }
}

const params = new URLSearchParams(window.location.search);
const orderID = params.get('ID');
const container = document.getElementById('orderList');
const pageTitle = document.getElementById('pageTitle');

function renderOrders(orderData) {
  Object.entries(orderData).forEach(([name, stage]) => {
    const anchor = document.createElement('a');
    anchor.className = 'order-card';
    anchor.href = `progress.html?stage=${stage}`;

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

if (orderID === 'demo') {
  pageTitle.textContent = 'Your Orders (demo)';

  let demoData;

  // Check sessionStorage for previously generated demo data
  const storedDemoData = sessionStorage.getItem('demoOrders');
  if (storedDemoData) {
    demoData = JSON.parse(storedDemoData);
  } else {
    // Generate new random demo data
    const items = ['Saree', 'Shirt', 'Top'];
    demoData = {};

    items.forEach(item => {
      const randomStage = Math.floor(Math.random() * 5); // stage 0–4
      demoData[item] = randomStage;
    });

    sessionStorage.setItem('demoOrders', JSON.stringify(demoData));
  }

  renderOrders(demoData);

} else if (orderID) {
  const firebaseURL = `https://storage.googleapis.com/test1-1e3d0.appspot.com/orders/${orderID}.json?alt=media`;

  fetch(firebaseURL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(orderData => {
      if (typeof orderData === 'object' && orderData !== null) {
        console.log(orderData);
        renderOrders(orderData);
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

