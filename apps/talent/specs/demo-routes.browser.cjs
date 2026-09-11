const { chromium, expect } = require('@playwright/test');

const run = async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/'))
        requests.push(request.url());
    });
    await page.goto(
      process.env.TALENT_TEST_URL || 'http://localhost:3100/login',
    );
    await expect(
      page.getByRole('heading', { name: 'Тавтай морил' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Турших', exact: true }).click();
    await page
      .locator('.absolute.right-0')
      .getByRole('button', { name: 'Багш', exact: true })
      .click();
    const teacher = page.getByRole('button', {
      name: 'Турших · Багш',
      exact: true,
    });
    const student = page.getByRole('button', {
      name: 'Турших · Сурагч',
      exact: true,
    });
    await expect(teacher).toBeVisible();
    await expect(
      page.getByText('8А анги', { exact: true }).first(),
    ).toBeVisible();
    await page.reload();
    await expect(teacher).toBeVisible();
    await teacher.click();
    await page
      .locator('.absolute.right-0')
      .getByRole('button', { name: 'Сурагч', exact: true })
      .click();
    await expect(student).toBeVisible();
    await expect(
      page.getByText('Сайн уу, Номин!', { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(student).toBeVisible();
    await student.click();
    await page
      .locator('.absolute.right-0')
      .getByRole('button', { name: 'Багш', exact: true })
      .click();
    await expect(teacher).toBeVisible();
    expect(errors).toEqual([]);
    expect(requests).toEqual([]);
    console.log(
      'PASS: login → teacher → refresh → student → refresh → teacher; no API requests or browser errors.',
    );
  } finally {
    await browser.close();
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
