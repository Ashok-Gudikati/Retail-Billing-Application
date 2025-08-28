package com.ashok.RetailBillingApplication.repository;

import com.ashok.RetailBillingApplication.model.Order;
import com.ashok.RetailBillingApplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByOrderDate(LocalDate date);
}
