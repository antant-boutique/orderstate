function getStatusText(stage) {
      switch(stage) {
        case 'material': return 'Material collected';
        case 'printing': return 'Printing in progress';
        case 'tailoring': return 'Now tailoring...';
        case 'finishing': return 'Now finishing...';
        default: return 'In progress';
      }
}

const params = new URLSearchParams(window.location.search);
let ordersParam = params.get('orders');
let orders = [];

try {
      orders = JSON.parse(ordersParam);
    } catch (e) {
      console.error('Invalid JSON in orders param:', e);
    }

    const container = document.getElementById('orderList');

    orders.forEach(order => {
      const anchor = document.createElement('a');
      anchor.className = 'order-card';
      anchor.href = `progress.html?orderId=${order.id}&step=${order.step}&${order.stage}`;

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
