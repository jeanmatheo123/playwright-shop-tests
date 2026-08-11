import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { USERS, PASSWORD } from "../fixtures/users";

test.describe("Login", () => {
  test("standard_user reaches the inventory page", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await new InventoryPage(page).expectLoaded();
  });

  test("locked_out_user is rejected with the lockout message", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.lockedOut, PASSWORD);

    await login.expectError("Sorry, this user has been locked out");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });

  test("wrong password is rejected without revealing which field was wrong", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(USERS.standard, "not-the-real-password");

    await login.expectError("do not match any user in this service");
  });

  test("empty credentials are rejected client-side", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await page.click("[data-test='login-button']");

    await login.expectError("Username is required");
  });
});
