import { Page, expect } from "@playwright/test";

export class CheckoutPage {
  constructor(private page: Page) {}

  // --- step one: customer info ---
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill("[data-test='firstName']", firstName);
    await this.page.fill("[data-test='lastName']", lastName);
    await this.page.fill("[data-test='postalCode']", postalCode);
    await this.page.click("[data-test='continue']");
  }

  async expectMissingInfoError(message: string) {
    await expect(this.page.locator("[data-test='error']")).toContainText(message);
  }

  // --- step two: order overview ---
  async getPriceBreakdown() {
    const parse = async (testId: string) => {
      const text = await this.page.locator(`[data-test='${testId}']`).textContent();
      return Number(text?.replace(/[^\d.]/g, ""));
    };
    return {
      subtotal: await parse("subtotal-label"),
      tax: await parse("tax-label"),
      total: await parse("total-label"),
    };
  }

  async finish() {
    await this.page.click("[data-test='finish']");
  }

  async cancel() {
    await this.page.click("[data-test='cancel']");
  }

  // --- step three: confirmation ---
  async expectOrderComplete() {
    await expect(this.page.locator("[data-test='complete-header']")).toHaveText("Thank you for your order!");
  }
}
