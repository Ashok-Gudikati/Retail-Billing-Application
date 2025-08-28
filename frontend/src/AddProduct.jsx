import React, { useState } from "react";

function AddProduct() {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageUrl: "",
    description: "", // NEW: Add description to state
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const productToSave = {
      ...productData,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity, 10),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSave),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Product added successfully:", result);
      setMessage("Product added successfully!");
      setProductData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        imageUrl: "",
        description: "", // NEW: Reset the description field
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product: " + error.message);
    }
  };

  return (
    <div className="card">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={productData.category}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleChange}
          rows="4" // Make the textarea taller
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={productData.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={productData.imageUrl}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
      {message && (<p style={{ marginTop: "10px", textAlign: "center" }}>{message}</p>)}
    </div>
  );
}

export default AddProduct;
