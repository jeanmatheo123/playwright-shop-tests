import { Page, expect } from "@playwright/test";

export class InventoryPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await expect(this.page.locator("[data-test='inventory-container']")).toBeVisible();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    const values = { az: "az", za: "za", lohi: "lohi", hilo: "hilo" };
    await this.page.selectOption("[data-test='product-sort-container']", values[option]);
  }

  async getItemNames() {
    return this.page.locator("[data-test='inventory-item-name']").allTextContents();
  }

  async getItemPrices() {
    const texts = await this.page.locator("[data-test='inventory-item-price']").allTextContents();
    return texts.map((t) => Number(t.replace("$", "")));
  }

  async addItemToCartByName(name: string) {
    // add-to-cart button ids are derived from the product name, but not
    // consistently (one product's id keeps punctuation the others strip), so
    // scoping to the item card that contains this exact name is more robust
    // than trying to recompute the slug ourselves.
    const item = this.page.locator("[data-test='inventory-item']").filter({
      has: this.page.locator("[data-test='inventory-item-name']", { hasText: name }),
    });
    await item.locator("button", { hasText: "Add to cart" }).click();
  }

  async expectCartBadge(count: number) {
    if (count === 0) {
      await expect(this.page.locator("[data-test='shopping-cart-badge']")).toHaveCount(0);
      return;
    }
    await expect(this.page.locator("[data-test='shopping-cart-badge']")).toHaveText(String(count));
  }

  async goToCart() {
    await this.page.click("[data-test='shopping-cart-link']");
  }

  async openSideMenu() {
    await this.page.click("#react-burger-menu-btn");
  }

  async logoutFromSideMenu() {
    await this.openSideMenu();
    await this.page.click("[data-test='logout-sidebar-link']");
  }
}
