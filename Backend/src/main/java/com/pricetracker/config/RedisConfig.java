package com.pricetracker.config;

import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        try {
            System.out.println("====== FLUSHING EXPERIMENTAL REDIS CACHE RECORDS ======");
            connectionFactory.getConnection().serverCommands().flushDb();
            System.out.println("====== REDIS FLUSH COMPLETED SUCCESSFULLY ======");
        } catch (Exception e) {
            System.out.println("Redis flush failed or connection skipped: " + e.getMessage());
        }

        // 2. Build the default Jdk Binary Serialization configuration infrastructure
        JdkSerializationRedisSerializer valueSerializer = new JdkSerializationRedisSerializer();

        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10)) // Cache lifespan set to 10 minutes
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(valueSerializer));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }
}