package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.ProductSnapshots;

public interface SnapshotService {

    void saveSnapshot(ProductDTO dto);

    ProductSnapshots getLatestSnapshot(Long productId);
}

