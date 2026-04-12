import { test, expect } from "@playwright/test";

const MOCK_QUESTIONS = {
  questions: [
    {
      type: "qcm",
      question: "Combien font 2 + 2 ?",
      options: ["3", "4", "5", "6"],
      reponseCorrecte: "4",
      explication: "2 + 2 = 4. C'est une addition simple.",
    },
    {
      type: "vrai_faux",
      question: "La Terre est ronde.",
      reponseCorrecte: true,
      explication: "La Terre est bien une sphère légèrement aplatie aux pôles.",
    },
    {
      type: "reponse_courte",
      question: "Quelle est la capitale de la France ?",
      reponseCorrecte: "Paris",
      explication: "Paris est la capitale de la France depuis le Moyen Âge.",
    },
  ],
};

test.describe("Parcours quiz complet (API mockée)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/quiz/generate", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_QUESTIONS),
      });
    });
  });

  test("le quiz se charge et affiche la première question", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");

    // Le spinner peut disparaître très vite — on vérifie directement la question
    await expect(page.locator('[data-testid="question-texte"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Combien font 2 + 2 ?")).toBeVisible();
  });

  test("réponse QCM correcte affiche la correction", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");
    await expect(page.locator('[data-testid="options-qcm"]')).toBeVisible({ timeout: 10000 });

    await page.locator('[data-testid="options-qcm"] button', { hasText: "4" }).click();

    await expect(page.locator('[data-testid="correction-display"]')).toBeVisible();
    await expect(page.locator("text=Bonne réponse !")).toBeVisible();
  });

  test("réponse QCM incorrecte affiche la mauvaise réponse", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");
    await expect(page.locator('[data-testid="options-qcm"]')).toBeVisible({ timeout: 10000 });

    await page.locator('[data-testid="options-qcm"] button', { hasText: "3" }).click();

    await expect(page.locator('[data-testid="correction-display"]')).toBeVisible();
    await expect(page.locator("text=Mauvaise réponse")).toBeVisible();
  });

  test("parcours complet du quiz aboutit au score", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");

    // Q1 QCM
    await expect(page.locator('[data-testid="options-qcm"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="options-qcm"] button', { hasText: "4" }).click();
    await page.locator('[data-testid="btn-suivant"]').click();

    // Q2 Vrai/Faux
    await expect(page.locator('[data-testid="options-vrai-faux"]')).toBeVisible();
    await page.locator('[data-testid="options-vrai-faux"] button', { hasText: "Vrai" }).click();
    await page.locator('[data-testid="btn-suivant"]').click();

    // Q3 Réponse courte
    await expect(page.locator('[data-testid="form-reponse-courte"]')).toBeVisible();
    await page.locator('input[name="reponse"]').fill("Paris");
    await page.locator('[data-testid="form-reponse-courte"] button[type="submit"]').click();
    await page.locator('[data-testid="btn-suivant"]').click();

    // Score final
    await expect(page.locator('[data-testid="score-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-valeur"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-points"]')).toBeVisible();
  });

  test("le bouton Refaire relance un nouveau quiz", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");

    // Parcours rapide
    await expect(page.locator('[data-testid="options-qcm"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="options-qcm"] button').first().click();
    await page.locator('[data-testid="btn-suivant"]').click();
    await page.locator('[data-testid="options-vrai-faux"] button').first().click();
    await page.locator('[data-testid="btn-suivant"]').click();
    await page.locator('input[name="reponse"]').fill("test");
    await page.locator('[data-testid="form-reponse-courte"] button[type="submit"]').click();
    await page.locator('[data-testid="btn-suivant"]').click();

    await expect(page.locator('[data-testid="score-display"]')).toBeVisible();
    await page.locator('[data-testid="btn-recommencer"]').click();

    // Doit recharger le quiz
    await expect(page.locator('[data-testid="question-texte"]')).toBeVisible({ timeout: 10000 });
  });

  test("le bouton Retour aux chapitres fonctionne depuis le score", async ({ page }) => {
    await page.goto("/seconde/mathematiques/nombres-et-calculs/quiz");

    await expect(page.locator('[data-testid="options-qcm"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-testid="options-qcm"] button').first().click();
    await page.locator('[data-testid="btn-suivant"]').click();
    await page.locator('[data-testid="options-vrai-faux"] button').first().click();
    await page.locator('[data-testid="btn-suivant"]').click();
    await page.locator('input[name="reponse"]').fill("test");
    await page.locator('[data-testid="form-reponse-courte"] button[type="submit"]').click();
    await page.locator('[data-testid="btn-suivant"]').click();

    await page.locator('[data-testid="btn-retour-chapitres"]').click();
    await page.waitForURL("**/seconde/mathematiques", { timeout: 10000 });
    await expect(page).toHaveURL("/seconde/mathematiques");
  });
});
