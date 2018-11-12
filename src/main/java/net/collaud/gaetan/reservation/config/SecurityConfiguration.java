package net.collaud.gaetan.reservation.config;

import io.github.jhipster.security.AjaxLogoutSuccessHandler;
import net.collaud.gaetan.reservation.security.AuthoritiesConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

@Configuration
@EnableOAuth2Sso
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final CorsFilter corsFilter;

    private final SecurityProblemSupport problemSupport;

    @Value("${oauth2.issuer}")
    private String oauth2Issuer;

    public SecurityConfiguration(CorsFilter corsFilter, SecurityProblemSupport problemSupport) {
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
    }

    @Bean
    public AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler() {
        return new AjaxLogoutSuccessHandler();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/h2-console/**")
            .antMatchers("/swagger-ui/index.html")
            .antMatchers("/test/**");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .addFilterBefore(corsFilter, CsrfFilter.class)
            .exceptionHandling()
            .authenticationEntryPoint(problemSupport)
            .accessDeniedHandler(problemSupport)
            .and()
            .logout()
            .logoutUrl("/api/logout")
            .logoutSuccessHandler(ajaxLogoutSuccessHandler())
            .permitAll()
            .and()
            .headers()
            .frameOptions()
            .disable()
            .and()
            .authorizeRequests()
            .antMatchers("/api/profile-info").permitAll()
            .antMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/resource-types/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/users/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/account/**").permitAll()
            .antMatchers(HttpMethod.POST, "/api/reservations/search").permitAll()

            .antMatchers("/api/resource-types/**").hasAnyAuthority(AuthoritiesConstants.RESERVATION_CONFIG)
            .antMatchers("/api/resources/**").hasAnyAuthority(AuthoritiesConstants.RESERVATION_CONFIG)
            .antMatchers("/api/users/**").hasAnyAuthority(AuthoritiesConstants.RESERVATION_CONFIG, AuthoritiesConstants.RESERVATION_MANAGE)
            .antMatchers("/api/reservations/**").hasAnyAuthority(AuthoritiesConstants.USER)
            .antMatchers("/api/account/**").authenticated()
            .antMatchers("/api/**").hasAnyAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/management/info").permitAll()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").hasAnyAuthority(AuthoritiesConstants.ADMIN, AuthoritiesConstants.RESERVATION_MANAGE)
            .antMatchers("/v2/api-docs/**").permitAll()
            .antMatchers("/swagger-resources/configuration/ui").permitAll()
            .antMatchers("/swagger-ui/index.html").hasAnyAuthority(AuthoritiesConstants.ADMIN);

    }
}
