package com.ashok.RetailBillingApplication.controller;

import com.ashok.RetailBillingApplication.model.Transaction;
import com.ashok.RetailBillingApplication.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException; // NEW: Import for error handling
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.findAll();
        return ResponseEntity.ok(transactions);
    }

    // NEW: Endpoint to get total sales by date range
    @GetMapping("/total-sales")
    public ResponseEntity<Double> getTotalSalesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            double totalSales = transactionService.findTotalSalesByDateRange(start, end);
            return ResponseEntity.ok(totalSales);
        } catch (DateTimeParseException e) {
            // Handle parsing errors, e.g., if the date format is incorrect
            return ResponseEntity.badRequest().body(0.0);
        }
    }

    @PostMapping
    public ResponseEntity<Transaction> completeTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }
}