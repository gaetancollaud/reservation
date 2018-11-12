package net.collaud.gaetan.reservation.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

import net.collaud.gaetan.reservation.service.IcalLoaderService;

@Configuration
@EnableCaching
@AutoConfigureAfter(value = {MetricsConfiguration.class})
@AutoConfigureBefore(value = {WebConfigurer.class, DatabaseConfiguration.class})
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(IcalLoaderService.CACHE_ICAL_NAME, jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.ResourceType.class.getName(), jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.Resource.class.getName(), jcacheConfiguration);
            cm.createCache(net.collaud.gaetan.reservation.domain.Reservation.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
