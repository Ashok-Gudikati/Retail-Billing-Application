import React, { useState, useEffect } from "react";

function UpdateProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageUrl: "",
    description: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      description: product.description,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchProducts();
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        imageUrl: "",
        description: "",
      });
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product: " + err.message);
    }
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (response.status === 204) {
          setProducts(products.filter((p) => p.id !== productId));
          alert("Product deleted successfully!");
        } else if (response.status === 404) {
          alert("Product not found in the database. Please refresh the page.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error deleting product: " + err.message);
      }
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="danger">Error: {error}</div>;

  return (
    <div className="main-content" style={{ padding: 0 }}>
      <h2>Update/Delete Products</h2>

      {editingProduct && (
        <div className="card" style={{ marginBottom: "10px" }}>
          <h3>Editing: {editingProduct.name}</h3>
          <form onSubmit={handleUpdateSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name"
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Category"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Description"
              rows="4"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              placeholder="Price"
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleFormChange}
              placeholder="Quantity"
            />
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              placeholder="Image URL"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Product Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginTop: "10px",
                  border: "1px solid var(--border)",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-danger">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" style={{ width: "100%" }}>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            )}
            <h4 style={{ margin: "0 0 10px 0" }}>{product.name}</h4>
            <p style={{ margin: "0" }}>Price: ₹{product.price}</p>
            <p style={{ margin: "0 0 10px 0" }}>Qty: {product.quantity}</p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={() => handleEditClick(product)} className="btn btn-primary">Update</button>
              <button onClick={() => handleDeleteClick(product.id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateProducts;
