import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})

try {
  for (const device of [
    { name: 'celular', width: 390, height: 844, isMobile: true },
    { name: 'escritorio', width: 1280, height: 900, isMobile: false },
  ]) {
    const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1, isMobile: device.isMobile, hasTouch: device.isMobile })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto('http://localhost:4173/proyectos/', { waitUntil: 'networkidle' })
    await page.reload({ waitUntil: 'networkidle' })
    const result = await page.evaluate(() => ({
      viewport: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      projects: document.querySelectorAll('.project-list > li').length,
      externalLinks: [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href),
      logoPresent: Boolean(document.querySelector('.profile-logo')),
      logoLoaded: Boolean(document.querySelector('.profile-logo')?.naturalWidth),
      clippedDescriptions: [...document.querySelectorAll('.project-description')].filter((element) => element.scrollWidth > element.clientWidth).length,
    }))
    await page.screenshot({ path: `captura-${device.name}.png`, fullPage: true })
    console.log(JSON.stringify({ device: device.name, status: response.status(), ...result, errors }, null, 2))
    if (response.status() !== 200 || result.pageWidth > result.viewport || result.projects !== 8 || (result.logoPresent && !result.logoLoaded) || result.clippedDescriptions || errors.length) process.exitCode = 1
    await page.close()
  }
} finally {
  await browser.close()
}
