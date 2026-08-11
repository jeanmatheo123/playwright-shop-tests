import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS, PASSWORD } from "./users";

export async function loginAsStandardUser(page: Page) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERS.standard, PASSWORD);
  await page.waitForURL(/inventory\.html/);
}
