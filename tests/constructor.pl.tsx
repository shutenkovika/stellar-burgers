import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/app.har', {
    url: '**/api/**',
    update: false
  });

  await page.route('**/api/auth/user', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@test.ru', name: 'Test User' }
      })
    });
  });

  await page.goto('http://localhost:4000');

  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.reload();
  await page.waitForSelector('text=Краторная булка N-200i');
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('refreshToken');
  });
  await page.context().clearCookies();
});

test.describe('Тестирование конструктора бургера', () => {
  test('добавление булки в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();
    await expect(
      page.locator('text=Краторная булка N-200i (верх)')
    ).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await mainCard.locator('button:has-text("Добавить")').click();
    const constructor = page.locator('section').last();
    await expect(
      constructor.locator('text=Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
    await expect(page.locator('text=Детали ингредиента')).toBeVisible();
  });

  test('модальное окно показывает данные кликнутого ингредиента', async ({
    page
  }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
    await expect(page.locator('[data-cy="modal"]')).toBeVisible();
    await expect(
      page.locator('[data-cy="modal"]').locator('text=Краторная булка N-200i')
    ).toBeVisible();
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
    await expect(page.locator('text=Детали ингредиента')).toBeVisible();
    await page.locator('[data-cy="modal-close"]').click();
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            order: { number: 12345 },
            name: 'Тестовый бургер'
          })
        });
      } else {
        await route.continue();
      }
    });

    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    await page.locator('button:has-text("Оформить заказ")').click();

    await expect(page.locator('[data-cy="modal"]')).toBeVisible({
      timeout: 10000
    });
    await expect(page.locator('text=12345')).toBeVisible();

    await page.locator('[data-cy="modal-close"]').click();
    await expect(page.locator('[data-cy="modal"]')).not.toBeVisible();

    await expect(page.locator('text=Выберите булки').first()).toBeVisible();
  });
});
