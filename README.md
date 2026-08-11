# Playwright Shop Tests

![Playwright Tests](https://github.com/jeanmatheo123/playwright-shop-tests/actions/workflows/ci.yml/badge.svg)

End-to-end tests for [Sauce Demo](https://www.saucedemo.com), the standard practice app maintained by Sauce Labs, built with Playwright and TypeScript.

## What's covered

- **Login** — the standard account, the `locked_out_user` account (one of Sauce Demo's built-in accounts that simulates a banned user), a wrong password, and client-side required-field validation
- **Inventory** — sorting by price (asserting the list is actually numerically ordered, not just that the dropdown changed) and that adding items updates the cart badge
- **Cart** — removing an item, and that "Continue Shopping" preserves the cart
- **Checkout** — missing required info is rejected, the tax/total math is verified against the subtotal (8% tax) rather than hard-coded numbers, cancelling returns to the cart, and the full happy path to order confirmation

Sauce Demo ships with a fixed set of test accounts that each simulate a different bug (`problem_user` has broken product images, `performance_glitch_user` is slow to load) — see `fixtures/users.ts`. Only `standard_user` and `locked_out_user` are exercised here; the others are listed for anyone extending this suite.

## Structure

```
tests/       one spec file per feature area
pages/       page objects — Playwright locators, no assertions
fixtures/    test accounts + a loginAsStandardUser() helper shared across specs
```

`InventoryPage.addItemToCartByName` scopes to the product card that contains the given name rather than guessing the button's `data-test` id from the name — Sauce Demo's ids aren't consistently slugified (one product keeps punctuation the others strip), so matching by the card's content is the more reliable approach.

## Running it

```bash
npm install
npx playwright install --with-deps chromium
npm test              # headless, all specs
npm run test:headed   # watch it run in a real browser window
npm run report        # open the last HTML report
```

## CI

GitHub Actions runs the suite on every push to `main`, on pull requests, and weekly on a schedule. The HTML report is uploaded as a build artifact on every run (pass or fail) so a failure can be inspected without reproducing it locally.
