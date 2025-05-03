// Function to get status text based on stage number
function getStatusText(stage) {
  switch (stage) {
    case 0: return 'Assigning Material';
    case 1: return 'Printing in progress';
    case 2: return 'Tailoring in progress';
    case 3: return 'Finishing';
    case 4: return 'Ready for you';
    default: return 'In progress'; // Default status
  }
}

// Get orderID from URL parameters
const params = new URLSearchParams(window.location.search);
const orderID = params.get('orderID'); // Note: This variable is read but not currently used to build the URL

// Get the container element to display results
const container = document.getElementById('orderList');

// Check if an orderID was provided in the URL
if (orderID) {
  // URL of the specific JSON file on Google Cloud Storage
  // IMPORTANT: Ensure this bucket has CORS configured to allow requests from your domain.
  const firebaseURL = 'https://storage.googleapis.com/test1-1e3d0.appspot.com/orders/05022025-1.json?alt=media';
  // const firebaseURL = `https://storage.googleapis.com/your-bucket-name/orders/${orderID}.json?alt=media`; // Example if you wanted to use the orderID

  console.log(`Fetching data for orderID: ${orderID} from URL: ${firebaseURL}`); // Log which URL is being fetched

  // Fetch the JSON data using the standard fetch API (requires CORS)
  fetch(firebaseURL) // Removed { mode: 'no-cors' }
    .then(response => {
      // Check if the response status code indicates success (200-299)
      if (!response.ok) {
        // Throw an error with the actual HTTP status using backticks for template literal
        throw new Error(`HTTP error ${response.status}`);
      }
      // Parse the response body as JSON
      return response.json();
    })
    .then(orderData => {
      // Check if the parsed data is a valid object
      if (typeof orderData === 'object' && orderData !== null) {
        console.log("Successfully fetched and parsed order data:", orderData);

        // Clear previous content if any
        container.innerHTML = '';

        // Iterate over the key-value pairs (assuming format { name: stage })
        Object.entries(orderData).forEach(([name, stage]) => {
          // Create an anchor element for each order item
          const anchor = document.createElement('a');
          anchor.className = 'order-card'; // Apply CSS class for styling
          // Set the link destination (adjust query params as needed)
          anchor.href = `progress.html?step=4&stage=${stage}&itemName=${encodeURIComponent(name)}`; // Added itemName for clarity

          // Create div for the product name
          const nameDiv = document.createElement('div');
          nameDiv.className = 'product-name';
          nameDiv.textContent = name; // Display the item name

          // Create div for the order status
          const statusDiv = document.createElement('div');
          statusDiv.className = 'order-status';
          statusDiv.textContent = getStatusText(stage); // Get status text using the function

          // Append name and status divs to the anchor
          anchor.appendChild(nameDiv);
          anchor.appendChild(statusDiv);

          // Append the anchor (card) to the main container
          container.appendChild(anchor);
        });
      } else {
        // Handle cases where the response is not a valid object
        console.error('Parsed data is not a valid object:', orderData);
        container.textContent = 'Received invalid data format.';
        container.style.color = 'orange'; // Use a different color for this type of error
      }
    })
    .catch(error => {
      // Handle errors during fetch or JSON parsing
      console.error('Failed to load order data:', error);
      container.textContent = `Failed to load your order details. Error: ${error.message}`;
      container.style.color = 'red'; // Use red for fetch errors
    });

} else {
  // Handle case where no orderID is found in the URL
  console.log('No orderID found in URL parameters.');
  container.textContent = 'No order ID provided in URL.';
  container.style.color = 'white'; // Or another appropriate color
}

