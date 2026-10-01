import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto('http://localhost:4173/proyectos/', { waitUntil: 'networkidle' })
  await page.reload({ waitUntil: 'networkidle' })
  const result = await page.evaluate(() => ({
    viewport: window.innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    title: document.querySelector('h1')?.textContent,
    cards: document.querySelectorAll('.project-card').length,
    externalLinks: [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href),
  }))
  await page.screenshot({ path: 'mobile-full.png', fullPage: true })
  console.log(JSON.stringify({ status: response.status(), ...result, errors }, null, 2))
  if (response.status() !== 200 || result.pageWidth > result.viewport || result.cards !== 7 || errors.length) process.exitCode = 1
} finally {
  await browser.close()
}
