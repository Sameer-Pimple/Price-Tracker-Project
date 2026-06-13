package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.*;
import com.pricetracker.DTO.Amazon.*;
import com.pricetracker.DTO.SuccessScrapDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.PriceHistoryRepo;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.ProductSnapshotsRepo;
import com.pricetracker.service.ScrapersService.AmazonScraperService;
import com.pricetracker.service.ScrapersService.FlipshopeScraperService;
import com.pricetracker.util.HelperFunction;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// ... keep imports and class definitions the same ...

@Service
@RequiredArgsConstructor
@Transactional
public class PriceTrackingService {

    private final ProductRepo productRepo;
    private final ProductSnapshotsRepo snapshotsRepo;
    private final PriceHistoryRepo priceHistoryRepo;

    private final AmazonScraperService amazonScraperService;
    private final FlipshopeScraperService flipshopeScraperService;

    private final ProductService productService;
    private final StoreService storeService;
    private final SnapshotService snapshotService;
    private final PriceHistoryService priceHistoryService;
    private final StoreSalesService storeSalesService;

    // 1. Inject the CacheManager to manually kick out specific keys
    private final org.springframework.cache.CacheManager cacheManager;

    public ResponseEntity<SuccessScrapDTO> trackByAmazonUrl(String url) {

        String asin = HelperFunction.extractAsin(url);
        Optional<Product> productOpt = productRepo.findByPid(asin);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            Optional<AmazonScraperDTO> scraperDTO = amazonScraperService.scrapeAmazonProduct(url);
            if (scraperDTO.isEmpty()) {
                return ResponseEntity.notFound().build(); // Added missing .build() to fix compile error
            }

            AmazonScraperDTO dto = scraperDTO.get();
            Optional<ProductSnapshots> snapshotOpt = snapshotsRepo.findByProduct(product);

            if (snapshotOpt.isPresent()) {
                ProductSnapshots snapshot = snapshotOpt.get();
                snapshot.setPrice(dto.getPrice());
                snapshot.setMRP(dto.getMRP());
                snapshot.setRating(dto.getRating());
                snapshot.setAvailability(dto.getAvailability());
                snapshot.setDiscount(dto.getDiscount());
                snapshotsRepo.save(snapshot);
            }

            boolean exists = priceHistoryRepo.existsByProductAndDate(product, LocalDate.now());
            if (!exists) {
                PriceHistory history = new PriceHistory();
                history.setProduct(product);
                history.setPrice(dto.getPrice());
                history.setDate(LocalDate.now());
                history.setStore(snapshotOpt.get().getStore());
                priceHistoryRepo.save(history);
            }
            evictCache("productDetails", product.getPid());

            return ResponseEntity.ok(new SuccessScrapDTO(true, "Successful", product.getPid()));
        }

        // --- New Product (Flipshope flow) ---
        RootDTO rootDTO = flipshopeScraperService.scrapeFlipshopProduct(url);
        PagePropsDTO pagePropsDTO = rootDTO.getPageProps();

        List<StoreDTO> stores = pagePropsDTO.getStoreforProducts();
        List<StoreSaleDTO> storeSaleList = pagePropsDTO.getStoreSalesData();

        StoreDTO storeDTO;

        // 1. Store Assignment Logic
        if (stores != null && !stores.isEmpty()) {
            storeDTO = stores.getFirst(); // Real store present
        } else {
            storeDTO = StoreDTO.defaultStore(); // Use memory-only default store
        }

        // This will save to the DB if it's a real store,
        // or return a transient object if it's the default store.
        Store store = storeService.getOrCreateStore(storeDTO);

        // 2. Product Mappings
        ProductDTO productDTO = pagePropsDTO.getProduct();
        productDTO.setRating(Float.valueOf(rootDTO.getRating()));
        productDTO.setAvailability(rootDTO.getAvailability());
        productDTO.setDiscount(Integer.valueOf(rootDTO.getDiscount()));

        List<GraphDataDTO> graphDataList = pagePropsDTO.getGraph_Products_details();

        Product product = productService.getOrCreateProduct(productDTO);
        snapshotService.saveSnapshot(productDTO);

        // Passing the store here works perfectly, whether it's database-persisted or transient
        priceHistoryService.saveHistory(product, store, graphDataList);

        // 3. Store Sales Conditional Logic: Skip entirely if not present
        if (storeSaleList != null && !storeSaleList.isEmpty()) {
            storeSalesService.saveSales(storeSaleList);
        }

        evictCache("products", "all_products");
        return ResponseEntity.ok(new SuccessScrapDTO(true, "Successful", productDTO.getPid()));
    }

    // Quick helper method to make eviction clean and prevent NullPointerExceptions
    private void evictCache(String cacheName, Object key) {
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }
}