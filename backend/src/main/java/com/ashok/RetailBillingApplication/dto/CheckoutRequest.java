package com.ashok.RetailBillingApplication.dto;

import java.util.List;

public class CheckoutRequest {
    private List<SaleRequest> saleRequests;

    // Getters and Setters
    public List<SaleRequest> getSaleRequests() {
        return saleRequests;
    }

    public void setSaleRequests(List<SaleRequest> saleRequests) {
        this.saleRequests = saleRequests;
    }
}