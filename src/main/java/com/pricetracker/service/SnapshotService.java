package com.pricetracker.service;

import com.pricetracker.DTO.ProductDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.ProductSnapshotsRepo;
import org.springframework.stereotype.Service;

@Service
public class SnapshotService {

    private final ProductSnapshotsRepo repo;

    public SnapshotService(ProductSnapshotsRepo repo) {
        this.repo = repo;
    }

    public void save(Product product, Store store, ProductDTO dto) {

        ProductSnapshots snap = new ProductSnapshots();
        snap.setProduct(product);
        snap.setStore(store);
        snap.setPrice(dto.getPrice());
        snap.setMRP(dto.getMrp());
        snap.setRating(dto.getRating());
        snap.setStock(dto.getStock());

        repo.save(snap);
    }
}

