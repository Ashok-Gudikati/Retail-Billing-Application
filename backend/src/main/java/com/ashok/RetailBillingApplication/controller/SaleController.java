package com.ashok.RetailBillingApplication.controller;

import com.ashok.RetailBillingApplication.dto.CheckoutRequest;
import com.ashok.RetailBillingApplication.dto.ReceiptResponse;
import com.ashok.RetailBillingApplication.model.Transaction;
import com.ashok.RetailBillingApplication.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    // UPDATED: Endpoint to process a full cart and return the full transaction
    @PostMapping("/checkout")
    public ResponseEntity<Transaction> processCart(@RequestBody CheckoutRequest checkoutRequest) {
        if (checkoutRequest.getSaleRequests().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Transaction transaction = saleService.processCart(checkoutRequest);
        return ResponseEntity.ok(transaction);
    }

    // Get a single transaction as a formatted receipt
    @GetMapping("/{id}")
    public ResponseEntity<ReceiptResponse> getReceipt(@PathVariable Long id) {
        Optional<Transaction> transaction = saleService.getTransactionById(id);
        if (transaction.isPresent()) {
            Transaction t = transaction.get();
            ReceiptResponse receipt = new ReceiptResponse();
            receipt.setTransactionId(t.getId());
            receipt.setTransactionDate(t.getTransactionDate());
            receipt.setPaymentMethod(t.getPaymentMethod());
            receipt.setGrandTotal(t.getGrandTotal());
            receipt.setItems(
                    t.getSaleItems().stream().map(item -> {
                        ReceiptResponse.ReceiptItem ri = new ReceiptResponse.ReceiptItem();
                        ri.setProductName(item.getProductName());
                        ri.setQuantity(item.getQuantity());
                        ri.setPricePerUnit(item.getPrice());
                        return ri;
                    }).collect(Collectors.toList())
            );
            return ResponseEntity.ok(receipt);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}