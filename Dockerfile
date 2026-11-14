FROM maven:3.9.9-eclipse-temurin-25 AS build
WORKDIR /workspace

COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw mvnw
RUN chmod +x mvnw

COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 39000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
