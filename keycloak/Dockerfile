# Use the official Keycloak image as the base
FROM quay.io/keycloak/keycloak:26.1.2 AS builder

# Enable health and metrics support (recommended for production)
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure the database vendor to PostgreSQL
ENV KC_DB=postgres

WORKDIR /opt/keycloak
# Build the optimized configuration for Keycloak
RUN /opt/keycloak/bin/kc.sh build

# The final lightweight image
FROM quay.io/keycloak/keycloak:26.1.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Expose Keycloak port
EXPOSE 8080

# By default, start Keycloak in dev mode. 
# For production, you will change this command to "start"
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev"]
