package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.*;
import com.pricetracker.DTO.Amazon.*;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.entity.Store;
import com.pricetracker.repository.PriceHistoryRepo;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.ProductSnapshotsRepo;
import com.pricetracker.service.ScrapersService.AmazonScraperService;
import com.pricetracker.service.ScrapersService.FlipshopeScraperService;
import com.pricetracker.util.ScraperHelper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    public TrackResultDTO trackByAmazonUrl(String url) {

        //Getting ASIN
        String asin = ScraperHelper.extractAsin(url);

        Optional<Product> productOpt = productRepo.findByPid(asin);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            // 1. Scrape latest data from Amazon
            Optional<ScraperDTO> scraperDTO = amazonScraperService.scrapeAmazonProduct(url);
            if (scraperDTO.isEmpty()) {
                return new TrackResultDTO(false, "Unable to fetch product data", null);
            }

            ScraperDTO dto = scraperDTO.get();

            //Getting Snapshot of Product
            Optional<ProductSnapshots> snapshotOpt = snapshotsRepo.findByProduct(product);

            // UPDATE snapshot
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
                // Create History
            if (!exists) {
                PriceHistory history = new PriceHistory();
                history.setProduct(product);
                history.setPrice(dto.getPrice());
                history.setDate(LocalDate.now());
                history.setStore(snapshotOpt.get().getStore());
                priceHistoryRepo.save(history);
            }

            return new TrackResultDTO(
                    true,
                    "Product already exists, tracking updated",
                    product.getPid()
            );
        }

        RootDTO rootDTO = flipshopeScraperService.scrapeFlipshopProduct(url);
        PagePropsDTO pagePropsDTO = rootDTO.getPageProps();

        List<StoreDTO> stores = pagePropsDTO.getStoreforProducts();
        List<StoreSaleDTO> storeSaleList = pagePropsDTO.getStoreSalesData();

        if (stores == null || stores.isEmpty())
            throw new RuntimeException("No store data");

        if (storeSaleList == null || storeSaleList.isEmpty())
            throw new RuntimeException("No store sales data");

        StoreDTO storeDTO = stores.getFirst();

// 🔥 MERGE ID FROM SALES DATA
        storeDTO.setStore_id(storeSaleList.getFirst().getStoreId());

        Store store = storeService.getOrCreateStore(storeDTO);

        ProductDTO productDTO = pagePropsDTO.getProduct();

        //here we are setting the filed which is not in flipshope json so we are extract from Amazon pages while url fetching...
        productDTO.setRating(Float.valueOf(rootDTO.getRating()));
        productDTO.setAvailability(rootDTO.getAvailability());
        productDTO.setDiscount(Integer.valueOf(rootDTO.getDiscount()));


        List<GraphDataDTO> graphDataList = pagePropsDTO.getGraph_Products_details();


        Product product = productService.getOrCreateProduct(productDTO);

        snapshotService.saveSnapshot(productDTO);
        priceHistoryService.saveHistory(product, store, graphDataList);
        storeSalesService.saveSales(storeSaleList);


        return new TrackResultDTO(
                true,
                "Product tracked successfully",
                product.getPid()
        );
    }

}


