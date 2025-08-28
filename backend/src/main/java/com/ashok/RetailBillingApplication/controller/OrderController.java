package com.ashok.RetailBillingApplication.controller;

import com.ashok.RetailBillingApplication.model.Order;
import com.ashok.RetailBillingApplication.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // Place an order
    @PostMapping("/place")
    public Order placeOrder(@RequestParam Long userId, @RequestBody List<Long> productIds) {
        return orderService.placeOrder(userId, productIds);
    }

    // Get all orders by a specific user
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    // Get all orders by a specific date (yyyy-MM-dd)
    @GetMapping("/date")
    public List<Order> getOrdersByDate(@RequestParam  String date) {
        return orderService.getOrdersByDate(LocalDate.parse(date));
    }
}

