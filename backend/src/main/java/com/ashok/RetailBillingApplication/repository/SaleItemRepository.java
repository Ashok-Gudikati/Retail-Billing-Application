package com.ashok.RetailBillingApplication.repository;

import com.ashok.RetailBillingApplication.model.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
}