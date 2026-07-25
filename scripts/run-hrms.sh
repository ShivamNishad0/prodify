#!/bin/bash
# Script to run the HRMS Backend Microservice

echo "Starting HRMS Backend Microservice on port 8181..."
cd microservices/hrms-backend

# Ensure mvnw is executable
chmod +x mvnw

# Force Maven to use Java 17 to fix Lombok compiler bug with Java 26
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home

# Start Spring Boot application using global maven
mvn spring-boot:run
