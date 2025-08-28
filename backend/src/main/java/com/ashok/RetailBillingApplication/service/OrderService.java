package com.ashok.RetailBillingApplication.service;

import com.ashok.RetailBillingApplication.model.Order;
import com.ashok.RetailBillingApplication.model.Product;
import com.ashok.RetailBillingApplication.model.User;
import com.ashok.RetailBillingApplication.repository.OrderRepository;
import com.ashok.RetailBillingApplication.repository.ProductRepository;
import com.ashok.RetailBillingApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Order placeOrder(Long userId, List<Long> productIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Product> products = productRepository.findAllById(productIds);

        double total = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setProducts(products);
        order.setTotalAmount(total);
        order.setOrderDate(LocalDate.now());

        return orderRepository.save(order);
    }

    // ✅ Get all orders by a specific user
    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    // ✅ Get all orders by a specific date
    public List<Order> getOrdersByDate(LocalDate date) {
        return orderRepository.findByOrderDate(date);
    }

}
