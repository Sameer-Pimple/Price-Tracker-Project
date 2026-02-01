package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.entity.Store;
import com.pricetracker.mapper.ProductSnapshotsMapper;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.ProductSnapshotsRepo;
import com.pricetracker.repository.StoreRepo;
import org.springframework.stereotype.Service;

@Service
public class SnapshotServiceImpl implements SnapshotService{

    private final ProductSnapshotsMapper mapper;
    private final ProductSnapshotsRepo repo;
    private final ProductRepo productRepo;
    private final StoreRepo storeRepo;


    public SnapshotServiceImpl(ProductSnapshotsRepo repo, ProductRepo productRepo, StoreRepo storeRepo, ProductSnapshotsMapper mapper) {
        this.mapper = mapper;
        this.repo = repo;
        this.productRepo = productRepo;
        this.storeRepo = storeRepo;

    }

    @Override
    public void saveSnapshot(ProductDTO dto) {
        Product product =  productRepo.findByPid(dto.getPid()) .orElseThrow(() -> new RuntimeException("Product not found"));
        Store store = storeRepo.findByName(dto.getStore_name()) .orElseThrow(() -> new RuntimeException("Store not Found"));
        repo.save(mapper.toEntity(product,store,dto));
    }
    @Override
    public ProductSnapshots getLatestSnapshot(Long productId){
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return repo
                .findTopByProductOrderByScapedAtDesc(product)
                .orElseThrow(() -> new RuntimeException("No snapshot found"));
    }
}