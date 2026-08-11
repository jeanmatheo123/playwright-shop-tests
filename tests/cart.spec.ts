import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { loginAsStandardUser } from "../fixtures/login";

test.describe("Cart", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test("removing an item takes it out of the cart and drops the badge", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const names = await inventory.getItemNames();

    await inventory.addItemToCartByName(names[0]);
    await inventory.addItemToCartByName(names[1]);
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.expectItemCount(2);

    await cart.removeItemByName(names[0]);
    await cart.expectItemCount(1);
    await inventory.expectCartBadge(1);
  });

  test("continue shopping returns to the inventory page with the cart intact", async ({ page }) => {
    const inventory = new InventoryPage(page);
    const names = await inventory.getItemNames();
    await inventory.addItemToCartByName(names[0]);
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await inventory.expectCartBadge(1);
  });
});
