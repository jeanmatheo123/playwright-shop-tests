import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { loginAsStandardUser } from "../fixtures/login";

// Runs only under the "Mobile Chrome" project (see playwright.config.ts) —
// a real mobile viewport, user agent and touch-capable context, not just a
// resized desktop window.
test.describe("Mobile viewport", () => {
  test("logging in and shopping works on a mobile viewport", async ({ page }) => {
    await loginAsStandardUser(page);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();

    const names = await inventory.getItemNames();
    await inventory.addItemToCartByName(names[0]);
    await inventory.expectCartBadge(1);
  });

  test("the slide-out menu opens and logs the user out", async ({ page }) => {
    await loginAsStandardUser(page);

    const inventory = new InventoryPage(page);
    await inventory.logoutFromSideMenu();

    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
});
