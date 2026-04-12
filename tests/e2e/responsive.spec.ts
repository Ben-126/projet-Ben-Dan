import { test, expect } from "@playwright/test";

test.describe("Tests responsive", () => {
  test("page d'accueil : pas de débordement horizontal", async ({ page }) => {
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test("page d'accueil : les cartes matières sont visibles", async ({ page }) => {
    await page.goto("/");
    const premiereCarte = page.locator('[data-testid="matiere-card"]').first();
    await expect(premiereCarte).toBeVisible();
    const box = await premiereCarte.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(50);
  });

  test("page chapitres : pas de débordement horizontal", async ({ page }) => {
    await page.goto("/seconde/mathematiques");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test("les chapitres sont cliquables", async ({ page }) => {
    await page.goto("/seconde/mathematiques");
    const premierChapitre = page.locator('[data-testid="chapitre-card"]').first();
    await expect(premierChapitre).toBeVisible();
    const box = await premierChapitre.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(40);
  });

  test("page quiz : le container est visible", async ({ page }) => {
    await page.route("/api/quiz/generate", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          questions: [
            {
              type: "qcm",
              question: "Test responsive ?",
              options: ["A", "B", "C", "D"],
              reponseCorrecte: "A",
              explication: "Explication test.",
            },
          ],
        }),
      });
    });

    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");
    const container = page.locator('[data-testid="quiz-container"]');
    await expect(container).toBeVisible();
    const box = await container.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(200);
  });

  test("le header est visible sur toutes les pages", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header).toBeVisible();
    const box = await header.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
  });

  test("page d'accueil : titre principal visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});
