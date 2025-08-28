package com.ashok.RetailBillingApplication.repository;

import com.ashok.RetailBillingApplication.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT SUM(t.grandTotal) FROM Transaction t WHERE t.transactionDate >= :startOfDay AND t.transactionDate <= :endOfDay")
    Double findTotalSalesForDay(LocalDateTime startOfDay, LocalDateTime endOfDay);
}