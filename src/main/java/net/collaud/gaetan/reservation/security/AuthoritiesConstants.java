package net.collaud.gaetan.reservation.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String RESERVATION_CONFIG = "ROLE_RESERVATION_CONFIG";
    public static final String RESERVATION_MANAGE = "ROLE_RESERVATION_MANAGE";
    public static final String RESERVATION_USE = "ROLE_RESERVATION_USE";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {
    }
}
