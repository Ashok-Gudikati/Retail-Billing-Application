package com.ashok.RetailBillingApplication.dto;

public class SaleRequest {
    private Long productId;
    private int quantity;
    private String paymentMethod; // <-- ADDED THIS FOR PAYMENT METHOD

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}