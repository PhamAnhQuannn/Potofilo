// E2E — 2 fix intro: (A) hành tinh nền không hiện trong intro; (B) click không skip.
// Dùng hook tất định window.__b4state (bật bằng ?debug). Chạy: npx playwright test
const { test, expect } = require('@playwright/test');

const totalIntroMs = 9100 + 1200; // void+charge+explode+planets+cascade+crystallize (~9.1s) + buffer ALIVE

test.describe('BUG A — hành tinh nền chỉ hiện ở ALIVE (không đè hạt nổ)', () => {
  test('giữa cascade: revealA toàn 0, preAlive=true, chưa alive', async ({ page }) => {
    await page.goto('/?intro&debug');
    await expect(page.locator('body')).toHaveClass(/cosmic-intro-running/, { timeout: 5000 });
    await page.waitForTimeout(4500); // ~giữa explode/cascade
    const s = await page.evaluate(() => (window.__b4state ? window.__b4state() : null));
    expect(s).not.toBeNull();
    expect(s.B4ON).toBe(true);
    expect(s.alive).toBe(false);
    expect(s.preAlive).toBe(true);
    expect(s.revealA.distant).toBeLessThan(0.01);
    expect(s.revealA.rocky).toBeLessThan(0.01);
    expect(s.revealA.ice).toBeLessThan(0.01);
    expect(s.revealA.anchor).toBeLessThan(0.01);
  });

  test('sau ALIVE: alive=true, revealA toàn 1 (thiên thể hiện đủ)', async ({ page }) => {
    await page.goto('/?intro&debug');
    await page.waitForTimeout(totalIntroMs);
    const s = await page.evaluate(() => (window.__b4state ? window.__b4state() : null));
    expect(s.alive).toBe(true);
    expect(s.revealA.anchor).toBeGreaterThan(0.99);
    expect(s.revealA.ice).toBeGreaterThan(0.99);
    expect(s.coreEnergyV).toBeGreaterThan(0.99);
  });

  test('?b4=off: bản cũ (revealA=1 sẵn, không preAlive)', async ({ page }) => {
    await page.goto('/?b4=off&debug');
    await page.waitForTimeout(1200);
    const s = await page.evaluate(() => (window.__b4state ? window.__b4state() : null));
    expect(s.B4ON).toBe(false);
    expect(s.preAlive).toBe(false);
    expect(s.revealA.anchor).toBe(1);
  });
});

test.describe('BUG B — click bất kỳ KHÔNG skip intro', () => {
  test('click giữa + 4 góc → vẫn trong intro, session chưa set', async ({ page }) => {
    await page.goto('/?intro');
    await expect(page.locator('body')).toHaveClass(/cosmic-intro-running/, { timeout: 5000 });
    const vp = page.viewportSize();
    for (const [x, y] of [[vp.width / 2, vp.height / 2], [8, 8], [vp.width - 8, 8], [8, vp.height - 8], [vp.width - 8, vp.height - 8]])
      await page.mouse.click(Math.round(x), Math.round(y));
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => document.body.className)).toContain('cosmic-intro-running');
    expect(await page.evaluate(() => sessionStorage.getItem('cosmic-intro-seen'))).not.toBe('1');
  });

  test('nút Bỏ qua VẪN skip', async ({ page }) => {
    await page.goto('/?intro');
    await expect(page.locator('body')).toHaveClass(/cosmic-intro-running/, { timeout: 5000 });
    await page.locator('#skip-intro').click();
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => sessionStorage.getItem('cosmic-intro-seen'))).toBe('1');
  });

  test('Escape VẪN skip', async ({ page }) => {
    await page.goto('/?intro');
    await expect(page.locator('body')).toHaveClass(/cosmic-intro-running/, { timeout: 5000 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => sessionStorage.getItem('cosmic-intro-seen'))).toBe('1');
  });

  test('sau intro: tile khôi phục pointer-events (không hỏng ALIVE)', async ({ page }) => {
    await page.goto('/?intro');
    await page.locator('#skip-intro').click({ timeout: 6000 });
    await page.waitForTimeout(900);
    const pe = await page.evaluate(() => getComputedStyle(document.getElementById('bento')).pointerEvents);
    expect(pe).toBe('auto');
  });
});
