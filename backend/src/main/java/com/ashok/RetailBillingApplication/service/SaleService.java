package com.ashok.RetailBillingApplication.service;

import com.ashok.RetailBillingApplication.dto.CheckoutRequest;
import com.ashok.RetailBillingApplication.dto.SaleRequest;
import com.ashok.RetailBillingApplication.exception.ResourceNotFoundException;
import com.ashok.RetailBillingApplication.model.Product;
import com.ashok.RetailBillingApplication.model.SaleItem;
import com.ashok.RetailBillingApplication.model.Transaction;
import com.ashok.RetailBillingApplication.repository.ProductRepository;
import com.ashok.RetailBillingApplication.repository.SaleItemRepository;
import com.ashok.RetailBillingApplication.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SaleItemRepository saleItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Transaction processCart(CheckoutRequest checkoutRequest) {
        List<SaleRequest> saleRequests = checkoutRequest.getSaleRequests();

        if (saleRequests.isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty");
        }

        double grandTotal = 0;
        Transaction transaction = new Transaction();
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setPaymentMethod("Cash");

        List<SaleItem> saleItems = saleRequests.stream().map(request -> {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + request.getProductId()));

            if (product.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient quantity for product: " + product.getName());
            }

            product.setQuantity(product.getQuantity() - request.getQuantity());
            productRepository.save(product);

            double itemTotal = product.getPrice() * request.getQuantity();

            SaleItem saleItem = new SaleItem();
            saleItem.setTransaction(transaction);
            saleItem.setProductId(product.getId());
            saleItem.setProductName(product.getName());
            saleItem.setQuantity(request.getQuantity());
            saleItem.setPrice(product.getPrice());
            saleItem.setTotalPrice(itemTotal);

            return saleItem;
        }).collect(Collectors.toList());

        grandTotal = saleItems.stream().mapToDouble(SaleItem::getTotalPrice).sum();
        transaction.setGrandTotal(grandTotal);

        transactionRepository.save(transaction);

        saleItems.forEach(item -> item.setTransaction(transaction));
        saleItemRepository.saveAll(saleItems);

        transaction.setSaleItems(saleItems);

        return transaction;
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }
}