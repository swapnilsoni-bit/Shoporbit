# ShopOrbit - eCommerce Application

ShopOrbit is a sleek and intuitive eCommerce platform that allows users to browse and purchase products from a wide variety of categories. It integrates with the Fake Store API to fetch products, handle user authentication, and manage categories and product sorting.

**Live App**: [ShopOrbit](https://shoporbit.netlify.app/)

---

## API Endpoints

### 1. **Get Products**
- **URL**: `https://fakestoreapi.com/products`
- **Method**: `GET`
- **Description**: Retrieves a list of all available products.

### 2. **Get a Single Product**
- **URL**: `https://fakestoreapi.com/products/{id}`
- **Method**: `GET`
- **Description**: Retrieves details of a single product by its `id`.

### 3. **Sort Products by ID**
- **URL**: `https://fakestoreapi.com/products?sort=desc`
- **Method**: `GET`
- **Description**: Retrieves products sorted by ID in descending order.

### 4. **Get Product Categories**
- **URL**: `https://fakestoreapi.com/products/categories`
- **Method**: `GET`
- **Description**: Fetches a list of all available product categories for use in filters.

### 5. **Login User**
- **URL**: `https://fakestoreapi.com/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user for login using credentials.

---

## Features

- **User Authentication**: Secure login system for managing accounts.
- **Product Browsing**: Display products in a user-friendly interface.
- **Product Sorting**: Sort products based on ID in ascending or descending order.
- **Category Filtering**: Filter products based on different categories.

---

## Setup Instructions (For Local Development)

### 1. Clone the Repository

To get started, clone this repository to your local machine:

```bash
git clone https://github.com/swapnilsoni-bit/authenticate_assignment_swapnil_soni.git
cd authenticate_assignment_swapnil_soni
