import { Page, expect } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async expectItemCount(count: number) {
    await expect(this.page.locator("[data-test='inventory-item']")).toHaveCount(count);
  }

  async removeItemByName(name: string) {
    const item = this.page.locator("[data-test='inventory-item']").filter({
      has: this.page.locator("[data-test='inventory-item-name']", { hasText: name }),
    });
    await item.locator("button", { hasText: "Remove" }).click();
  }

  async continueShopping() {
    await this.page.click("[data-test='continue-shopping']");
  }

  async checkout() {
    await this.page.click("[data-test='checkout']");
  }
}
