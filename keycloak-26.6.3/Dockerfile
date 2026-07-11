# Start with the official Keycloak image
FROM quay.io/keycloak/keycloak:26.1.2 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Copy custom configuration, themes, and providers if you have modified them locally
COPY conf/ /opt/keycloak/conf/
COPY themes/ /opt/keycloak/themes/
COPY providers/ /opt/keycloak/providers/

# Build the optimized Keycloak configuration
RUN /opt/keycloak/bin/kc.sh build

# The final lightweight image
FROM quay.io/keycloak/keycloak:26.1.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Expose Keycloak port
EXPOSE 8080

# Default entrypoint starts it in development mode
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]
