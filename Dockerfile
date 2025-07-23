# Use Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Copy source code
COPY src src

# Make Gradle wrapper executable
RUN chmod +x ./gradlew

# Build the app
RUN ./gradlew clean build -x test

# Expose port
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
