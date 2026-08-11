import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { loginAsStandardUser } from "../fixtures/login";

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    const names = await inventory.getItemNames();
    await inventory.addItemToCartByName(names[0]);
    await inventory.addItemToCartByName(names[1]);
    await inventory.goToCart();
    await new CartPage(page).checkout();
  });

  test("rejects checkout when required customer info is missing", async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await page.click("[data-test='continue']");
    await checkout.expectMissingInfoError("First Name is required");
  });

  test("the tax and total are computed correctly from the subtotal", async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillCustomerInfo("Jean", "Navarro", "01310-100");

    const { subtotal, tax, total } = await checkout.getPriceBreakdown();

    // Sauce Demo charges a flat 8% tax; asserting the relationship instead of a
    // hard-coded total keeps this test valid even if the catalog prices change.
    expect(tax).toBeCloseTo(subtotal * 0.08, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test("completes the order end-to-end", async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.fillCustomerInfo("Jean", "Navarro", "01310-100");
    await checkout.finish();
    await checkout.expectOrderComplete();
  });

  test("cancelling from the info step returns to the cart", async ({ page }) => {
    await page.click("[data-test='cancel']");
    await expect(page).toHaveURL(/cart\.html/);
  });
});
