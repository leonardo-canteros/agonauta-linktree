import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})

try {
  for (const device of [
    { name: 'celular', width: 390, height: 844, isMobile: true },
    { name: 'celular-compacto', width: 320, height: 640, isMobile: true },
    { name: 'escritorio', width: 1280, height: 900, isMobile: false },
  ]) {
    const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1, isMobile: device.isMobile, hasTouch: device.isMobile })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto('http://localhost:4173/proyectos/', { waitUntil: 'networkidle' })
    await page.reload({ waitUntil: 'networkidle' })
    const triggers = page.locator('.project-trigger')
    const initialState = await triggers.evaluateAll((elements) => elements.every((element) => element.getAttribute('aria-expanded') === 'false'))
    await triggers.nth(0).click()
    const firstClickStays = page.url().endsWith('/proyectos/') && await triggers.nth(0).getAttribute('aria-expanded') === 'true'
    await triggers.nth(1).click()
    const oneAtATime = await triggers.nth(0).getAttribute('aria-expanded') === 'false' && await triggers.nth(1).getAttribute('aria-expanded') === 'true'
    await triggers.nth(1).click()
    const clickCloses = await triggers.nth(1).getAttribute('aria-expanded') === 'false'
    await triggers.nth(0).focus()
    await page.keyboard.press('Enter')
    const enterOpens = await triggers.nth(0).getAttribute('aria-expanded') === 'true'
    await page.keyboard.press('Space')
    const spaceCloses = await triggers.nth(0).getAttribute('aria-expanded') === 'false'
    for (const img of await page.locator('.thumb img').all()) await img.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => [...document.querySelectorAll('.thumb img')].every((img) => img.complete && img.naturalWidth > 0))
    await triggers.nth(0).click()
    await page.locator('h1').click()
    await page.waitForTimeout(350)
    const result = await page.evaluate(() => ({
      viewport: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      projects: document.querySelectorAll('.project-list > li').length,
      projectNames: [...document.querySelectorAll('.project-name')].map((element) => element.textContent),
      externalLinks: [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href),
      logoPresent: Boolean(document.querySelector('.profile-logo')),
      logoLoaded: Boolean(document.querySelector('.profile-logo')?.naturalWidth),
      imagesLoaded: [...document.querySelectorAll('.thumb img')].every((img) => img.naturalWidth > 0),
      detailExpanded: document.querySelector('.project-detail').getBoundingClientRect().height > 200,
      clippedDescriptions: [...document.querySelectorAll('.project-short')].filter((element) => element.scrollWidth > element.clientWidth).length,
    }))
    const linkResults = []
    for (const url of result.externalLinks) {
      const linkResponse = await page.request.get(url)
      linkResults.push({ url, status: linkResponse.status() })
      if (!linkResponse.ok()) process.exitCode = 1
    }
    await page.screenshot({ path: `captura-${device.name}.png`, fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const reducedMotion = await page.locator('.project-detail').first().evaluate((element) => getComputedStyle(element).transitionDuration === '0s')
    console.log(JSON.stringify({ device: device.name, status: response.status(), ...result, initialState, firstClickStays, oneAtATime, clickCloses, enterOpens, spaceCloses, reducedMotion, linkResults, errors }, null, 2))
    const expectedNames = ['Agronautas', 'TUS', 'Pía', 'Medbot', 'Desarrollo de software y robótica personalizado', 'Tilo']
    if (response.status() !== 200 || result.pageWidth > result.viewport || result.projects !== 6 || JSON.stringify(result.projectNames) !== JSON.stringify(expectedNames) || (result.logoPresent && !result.logoLoaded) || !result.imagesLoaded || !result.detailExpanded || result.clippedDescriptions || !initialState || !firstClickStays || !oneAtATime || !clickCloses || !enterOpens || !spaceCloses || !reducedMotion || errors.length) process.exitCode = 1
    await page.close()
  }
} finally {
  await browser.close()
}
