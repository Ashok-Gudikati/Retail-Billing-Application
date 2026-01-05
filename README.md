# Retail Billing Application

A full-stack retail billing application to manage product inventory and process sales transactions. The application provides an intuitive interface for cashiers to handle customer carts and maintain inventory efficiently.

## Features

### Admin:
- **Product Management:** Add new products and update existing product details.  
- **Transaction Overview:** View all transactions including sold items and total amount sold.  
- **Date Filtering:** Filter transactions by selecting specific dates.  

### User:
- **Product Catalog:** View all available products.  
- **Cart Management:** Add products to the cart.  
- **Quick Payment:** Complete a transaction by clicking a "Pay" button (simulated, not real payment).  

### Authentication:
- Both admin and user can log in using hardcoded credentials.

### General Features:
- **Search and Filter:** Search products by name and filter by category.  
- **Real-time Billing:** Add/remove items to a transaction cart with automatic price calculation.  
- **Inventory Management:** Updates product quantity in the database after each transaction.  

## Tech Stack

**Backend:**  
- Spring Boot (RESTful API)  
- Java  
- Maven  
- Spring Data JPA  
- MySQL Database  

**Frontend:**  
- React  
- Vite  
- CSS  
