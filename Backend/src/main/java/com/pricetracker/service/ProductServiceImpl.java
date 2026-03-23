package com.pricetracker.service;

import com.pricetracker.DTO.Flipshope.GraphDataDTO;
import com.pricetracker.DTO.Flipshope.ProductDTO;
import com.pricetracker.DTO.ProductDetailsDTO;
import com.pricetracker.DTO.ProductListDTO;
import com.pricetracker.entity.PriceHistory;
import com.pricetracker.entity.Product;
import com.pricetracker.entity.ProductSnapshots;
import com.pricetracker.repository.PriceHistoryRepo;
import com.pricetracker.repository.ProductRepo;
import com.pricetracker.repository.ProductSnapshotsRepo;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepo repo;
    private final ProductSnapshotsRepo  snapshotRepo;
    private final PriceHistoryRepo historyRepo;

    public ProductServiceImpl(ProductRepo repo, ProductSnapshotsRepo snapshotRepo, PriceHistoryRepo priceHistoryRepo) {
        this.repo = repo;
        this.snapshotRepo = snapshotRepo;
        this.historyRepo = priceHistoryRepo;
    }

    @Override
    public Product getOrCreateProduct(ProductDTO dto) {

        return repo.findByPid(dto.getPid())
                .orElseGet(() ->{
                    Product product = new Product();
                    product.setPid(dto.getPid());
                    product.setTitle(dto.getTitle());
                    product.setCategory(dto.getCat());
                    product.setImg_url(dto.getImgurl());
                    return repo.save(product);
                });
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Optional<Product> getProductByPid(String Pid) {
        return repo.findByPid(Pid);
    }

    @Override
    public List<Product> getAllProduct(){
        return repo.findAll();
    }

    // @Override
    // public ProductDetailsDTO getProductWithDetail(Long id) {

    //     Product p = repo.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Product not found"));

    //     ProductSnapshots s = snapshotRepo.findByProduct(p)
    //             .orElseThrow(() -> new RuntimeException("Snapshot not found"));

    //     ProductDetailsDTO dto = new ProductDetailsDTO();
    //     dto.setPid(p.getPid());
    //     dto.setTitle(p.getTitle());
    //     dto.setMrp(s.getMRP());
    //     dto.setPrice(s.getPrice());
    //     dto.setDiscount(s.getDiscount());
    //     dto.setAvailability(s.getAvailability());
    //     dto.setRating(s.getRating());
    //     dto.setImgurl(p.getImg_url());
    //     dto.setStore_imgurl(s.getStore().getLogoUrl());

    //     List<PriceHistory> historyList = historyRepo.findAllByProduct_IdOrderByDateAsc(p.getId());

    //     List<GraphDataDTO> graphData = historyList.stream()
    //             .map(h -> {
    //                 GraphDataDTO g = new GraphDataDTO();
    //                 g.setTime(h.getDate());
    //                 g.setMin_price(h.getPrice());
    //                 return g;
    //             })
    //             .toList();

    //     dto.setGraph_data(graphData);

    //     return dto;
    // }
    
    @Override
    public ProductDetailsDTO getProductWithDetail(String pid) {

        Product p = repo.findByPid(pid)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductSnapshots s = snapshotRepo.findByProduct(p)
                .orElseThrow(() -> new RuntimeException("Snapshot not found"));

        ProductDetailsDTO dto = new ProductDetailsDTO();
        dto.setId(p.getId());
        dto.setPid(p.getPid());
        dto.setTitle(p.getTitle());
        dto.setMrp(s.getMRP());
        dto.setPrice(s.getPrice());
        dto.setDiscount(s.getDiscount());
        dto.setAvailability(s.getAvailability());
        dto.setRating(s.getRating());
        dto.setImgurl(p.getImg_url());
        dto.setStore_imgurl(s.getStore().getLogoUrl());

        List<PriceHistory> historyList = historyRepo.findAllByProduct_IdOrderByDateAsc(p.getId());

        List<GraphDataDTO> graphData = historyList.stream()
                .map(h -> {
                    GraphDataDTO g = new GraphDataDTO();
                    g.setTime(h.getDate());
                    g.setMin_price(h.getPrice());
                    return g;
                })
                .toList();

        dto.setGraph_data(graphData);

        return dto;
    }

    @Override
    public List<ProductListDTO> getAllProductWithInfo(){

        List<Product> products = repo.findAll();



        return products.stream()
                .map(p -> {

                    ProductSnapshots s = snapshotRepo.findByProduct(p)
                            .orElseThrow(() -> new RuntimeException("Snapshot not found"));


                    ProductListDTO dto = new ProductListDTO();
                    dto.setId(p.getId());
                    dto.setPid(p.getPid());
                    dto.setTitle(p.getTitle());
                    dto.setMrp(s.getMRP());
                    dto.setPrice(s.getPrice());
                    dto.setDiscount(s.getDiscount());
                    dto.setAvailability(s.getAvailability());
                    dto.setRating(s.getRating());
                    dto.setImgurl(p.getImg_url());
                    dto.setStore_imgurl(s.getStore().getLogoUrl());
                    return dto;
                }).toList();
    }

    @Override
    public List<ProductListDTO> getAllProductByCategory(String category){

        List<Product> products = repo.findAllByCategoryContainingIgnoreCase(category);

        return products.stream()
                .map(p -> {

                    ProductSnapshots s = snapshotRepo.findByProduct(p)
                            .orElseThrow(() -> new RuntimeException("Snapshot not found"));

                    ProductListDTO dto = new ProductListDTO();
            dto.setId(p.getId());
            dto.setPid(p.getPid());
            dto.setTitle(p.getTitle());
            dto.setMrp(s.getMRP());
            dto.setPrice(s.getPrice());
            dto.setDiscount(s.getDiscount());
            dto.setAvailability(s.getAvailability());
            dto.setRating(s.getRating());
            dto.setImgurl(p.getImg_url());
            dto.setStore_imgurl(s.getStore().getLogoUrl());
            return dto;
        }).toList();
    }

    @Override
    public List<ProductListDTO> getAllProductByDiscount(Integer discount) {

        List<ProductSnapshots> snapshots =
                snapshotRepo.findByDiscountGreaterThanEqual(discount);

        return snapshots.stream()
                .map(p -> {
                    ProductListDTO dto = new ProductListDTO();
                    dto.setId(p.getId());
                    dto.setPid(p.getProduct().getPid());
                    dto.setTitle(p.getProduct().getTitle());
                    dto.setMrp(p.getMRP());
                    dto.setPrice(p.getPrice());
                    dto.setDiscount(p.getDiscount());
                    dto.setAvailability(p.getAvailability());
                    dto.setRating(p.getRating());
                    dto.setImgurl(p.getProduct().getImg_url());
                    dto.setStore_imgurl(p.getStore().getLogoUrl());
                    return dto;
                }).toList();
    }

    @Override
    public List<Product> getProductForDailyUpdate(){
        LocalDateTime time = LocalDateTime.now().minusHours(4);
        Pageable limit = PageRequest.of(0, 20);

        return repo.findOldProductsWithActiveAlerts(time,limit);

    }
}
