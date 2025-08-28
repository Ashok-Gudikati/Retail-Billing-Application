package com.ashok.RetailBillingApplication.service;

import com.ashok.RetailBillingApplication.model.Transaction;
import com.ashok.RetailBillingApplication.model.SaleItem;
import com.ashok.RetailBillingApplication.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors; // NEW: Import Collectors

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    // NEW: Method to find total sales for a date range
    public double findTotalSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Transaction> transactions = transactionRepository.findAll();

        return transactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(startDate) && !t.getTransactionDate().isAfter(endDate))
                .mapToDouble(Transaction::getGrandTotal)
                .sum();
    }

    @Transactional
    public Transaction save(Transaction transaction) {
        transaction.setTransactionDate(LocalDateTime.now());
        List<SaleItem> saleItems = transaction.getSaleItems();
        if (saleItems != null) {
            for (SaleItem item : saleItems) {
                item.setTransaction(transaction);
            }
        }
        return transactionRepository.save(transaction);
    }
}