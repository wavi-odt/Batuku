const { chromium } = require('./node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.route('**/api/**', async route => {
    const url = route.request().url();
    if (url.includes('/api/artist-follows/my')) {
      await route.fulfill({ json: [{ id: 1, name: 'Djossa', avatarUrl: null, genre: 'Funaná', followerCount: 4280 }, { id: 2, name: 'Naia', avatarUrl: null, genre: 'Morna', followerCount: 3120 }]});
    } else if (url.includes('/api/tracks/following')) {
      await route.fulfill({ json: [
        { id: 1, title: 'Mar Salgado', artistName: 'Djossa', artistProfileId: 1, coverUrl: null, createdAt: new Date(Date.now() - 2*3600*1000).toISOString() },
        { id: 2, title: 'Noite di Lua', artistName: 'Naia', artistProfileId: 2, coverUrl: null, createdAt: new Date(Date.now() - 5*3600*1000).toISOString() },
      ]});
    } else if (url.includes('/api/artists/suggested')) {
      await route.fulfill({ json: [{ id: 4, name: 'Madá', avatarUrl: null, genre: 'Tabanka', followerCount: 2340 }]});
    } else { await route.continue(); }
  });
  await page.addInitScript(() => {
    const h = btoa(JSON.stringify({ alg: 'HS256' }));
    const p = btoa(JSON.stringify({ sub: '1', email: 'test@test.com', role: 'fan', name: 'Rafael Reis', exp: Math.floor(Date.now()/1000)+3600 }));
    localStorage.setItem('token', `${h}.${p}.sig`);
  });
  await page.goto('http://localhost:5175/following');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'D:/workspace/BatukuReact/following_fixed.png', fullPage: true });

  const coverEl = page.locator('.track-card__cover').first();
  if (await coverEl.count() > 0) {
    const box = await coverEl.boundingBox();
    console.log('cover box after fix:', JSON.stringify(box));
  }

  const feedContent = page.locator('.flw__feed-content').first();
  if (await feedContent.count() > 0) {
    const info = await feedContent.evaluate(el => ({ tag: el.tagName, href: el.href || null }));
    console.log('feed-content element:', JSON.stringify(info));
  }

  await browser.close();
  console.log('done');
})();
