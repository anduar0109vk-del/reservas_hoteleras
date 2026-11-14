package com.reservashoteleras;

import java.net.URI;
import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SeleniumLoginIT {
    private WebDriver driver;

    @BeforeEach
    void startBrowser() throws Exception {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");

        String chromeBinary = System.getenv("CHROME_BIN");
        if (chromeBinary != null && !chromeBinary.isBlank()) {
            options.setBinary(chromeBinary);
        }

        String remoteUrl = System.getenv("SELENIUM_REMOTE_URL");
        driver = remoteUrl == null || remoteUrl.isBlank()
                ? new ChromeDriver(options)
                : new RemoteWebDriver(URI.create(remoteUrl).toURL(), options);
    }

    @AfterEach
    void stopBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    void loginPageRendersHotelBrandAndLoginForm() {
        String baseUrl = System.getenv().getOrDefault(
            "SELENIUM_BASE_URL",
            System.getProperty("selenium.base.url", "http://localhost:5171/login"));
        driver.get(baseUrl);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".login-screen")));

        assertEquals("Casa Andina Hoteles", driver.getTitle());
        assertTrue(driver.findElement(By.cssSelector(".login-logo")).isDisplayed());
        assertTrue(driver.findElement(By.cssSelector("input[type='email']")).isDisplayed());
        assertTrue(driver.findElement(By.cssSelector("input[type='password']")).isDisplayed());
        assertTrue(driver.findElement(By.cssSelector("button[type='submit']")).getText().contains("Iniciar Sesión"));
    }
}