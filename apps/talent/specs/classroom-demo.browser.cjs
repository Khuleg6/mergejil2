const { chromium, expect } = require('@playwright/test');
const baseUrl = process.env.TALENT_TEST_URL || 'http://localhost:3000';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    const api = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (new URL(r.url()).pathname.startsWith('/api/')) api.push(r.url());
    });
    await page.goto(`${baseUrl}/login`);
    await page.evaluate(() => {
      localStorage.setItem('talent-demo-role', 'teacher');
      localStorage.removeItem('talent-classroom-demo-v1');
    });
    await page.goto(`${baseUrl}/teacher`);
    await expect(
      page.getByRole('heading', { name: 'Миний ангиуд' }),
    ).toBeVisible();
    await page.getByPlaceholder('Шинэ ангийн нэр').fill('Integration class');
    await page.getByRole('button', { name: 'Анги нэмэх', exact: true }).click();
    await page.reload();
    await expect(
      page.getByText('Integration class', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Integration class/ }).click();
    await page.getByRole('tab', { name: 'Унших эх', exact: true }).click();
    await page.getByPlaceholder('Жишээ нь: Намрын ой').fill('Монгол үгийн шалгалт');
    await page.getByPlaceholder('Унших эхээ энд бичих эсвэл хуулж оруулна уу.').fill('«Өвөө» үүл харлаа.');
    await page.getByRole('button', { name: 'Эхийг хадгалах', exact: true }).click();
    await page.getByRole('button', { name: '«Өвөө»', exact: true }).click();
    await page.getByRole('button', { name: 'үүл', exact: true }).click();
    await expect(page.locator('.picked-list')).toContainText('өвөө');
    await expect(page.locator('.picked-list')).toContainText('үүл');
    await page.getByRole('tab', { name: 'Ангиуд', exact: true }).click();
    await page.getByRole('button', { name: /8А анги/ }).click();
    for (const tab of ['Унших эх', 'Даалгавар', 'Үнэлгээ', 'Тайлан', 'Ангиуд'])
      await page.getByRole('tab', { name: tab, exact: true }).click();
    await page
      .getByRole('button', { name: 'Турших · Багш', exact: true })
      .click();
    await page.getByRole('button', { name: 'Сурагч', exact: true }).click();
    await expect(page.getByText('Сайн уу, Номин!')).toBeVisible();
    await page
      .getByRole('button', { name: 'Үгийн дасгал', exact: true })
      .click();
    await page
      .getByPlaceholder('Хариултаа энд бичээрэй.')
      .first()
      .fill('Integration response');
    await page
      .getByRole('button', { name: 'Хариултаа илгээх', exact: true })
      .first()
      .click();
    await page.reload();
    await page
      .getByRole('button', { name: 'Үгийн дасгал', exact: true })
      .click();
    await expect(
      page.getByText('Integration response', { exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Нэмэлт дасгал', exact: true })
      .click();
    await page.getByRole('button', { name: 'Миний дүр', exact: true }).click();
    await page
      .getByRole('combobox', { name: 'Туршилтын сурагч' })
      .selectOption('s2');
    await expect(
      page.getByRole('heading', { name: 'Өөрийн дүрийг сонгоорой' }),
    ).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole('button', { name: 'Турших · Сурагч', exact: true })
      .click();
    await page.getByRole('button', { name: 'Багш', exact: true }).click();
    await expect(
      page.getByText('Integration class', { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    expect(api).toEqual([]);
    console.log(
      'PASS: teacher tabs, saved class, role switching, student response persistence, practice, avatars, mobile layout; no API calls or browser errors.',
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
