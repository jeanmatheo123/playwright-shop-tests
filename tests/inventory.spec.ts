import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { loginAsStandardUser } from "../fixtures/login";

test.describe("Inventory", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test("sorting by price low to high actually orders the list", async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy("lohi");

    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("sorting by price high to low actually orders the list", async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy("hilo");

    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test("adding items updates the cart badge count", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const names = await inventory.getItemNames();

    await inventory.addItemToCartByName(names[0]);
    await inventory.expectCartBadge(1);

    await inventory.addItemToCartByName(names[1]);
    await inventory.expectCartBadge(2);
  });
});
