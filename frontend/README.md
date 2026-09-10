SHOPMART - React E-Commerce Frontend

A modern and responsive e-commerce frontend application built using React and Vite.

🚀 Features

- Product listing with category filtering
- Responsive product cards
- Reusable Button component
- Primary, Secondary and Danger button variants
- Custom "useFetch" React hook
- API data fetching
- Loading and error handling
- Shopping cart functionality
- Add products to cart
- Increase and decrease product quantity
- Remove products from cart
- Dynamic cart item count
- Cart total calculation
- Cart drawer with outside click to close
- Responsive navigation menu
- Responsive design for mobile and desktop
- Modern UI with Navbar and Footer

🛠️ Technologies Used

- React
- Vite
- JavaScript
- JSX
- CSS
- React Hooks
- Fake Store API

📁 Project Structure

src/
│
├── components/
│   ├── ApiProducts.jsx
│   ├── ApiProducts.css
│   ├── Button.jsx
│   ├── Button.css
│   ├── Cart.jsx
│   ├── Cart.css
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── Navbar.jsx
│   ├── Navbar.css
│   ├── ProductCard.jsx
│   ├── ProductCard.css
│   ├── ProductList.jsx
│   └── ProductList.css
│
├── hooks/
│   └── useFetch.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx

🛒 Shopping Cart Features

The shopping cart allows users to:

- Add products from the local product list
- Add products fetched from the API
- Increase product quantity
- Decrease product quantity
- Remove products from the cart
- View the total number of items
- View the total cart amount
- Close the cart by clicking outside the drawer

🔄 Custom useFetch Hook

The project includes a reusable custom React hook for API calls.

The hook manages:

- API data
- Loading state
- Error state

Example usage:

const { data, loading, error } = useFetch(
  "https://fakestoreapi.com/products"
);

🎨 Button Variants

The reusable Button component supports:

- Primary
- Secondary
- Danger

Example:

<Button variant="primary">
  Add to Cart
</Button>

📱 Responsive Design

The application is designed to work on:

- Mobile devices
- Tablets
- Laptops
- Desktop screens

CSS Grid and media queries are used to create a responsive layout.

⚙️ Installation and Setup

Clone the repository:

git clone YOUR_GITHUB_REPOSITORY_URL

Navigate to the project folder:

cd ecommerce-client

Install dependencies:

npm install

Run the application:

npm run dev

Open the local URL shown in the terminal.

🌐 API Used

This project uses the Fake Store API to fetch product data.

API endpoint:

"https://fakestoreapi.com/products"

📸 Future Improvements

- Product search functionality
- Product details page
- Persistent cart using localStorage
- User authentication
- Checkout page
- Payment integration
- Backend integration

👨‍💻 Developer

Sandesh Bhadane

React Developer | Frontend Developer

---