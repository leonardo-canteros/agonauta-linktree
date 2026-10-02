import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})

try {
  const expectedNames = [
    'Agronautas',
    'Jakaru Porá',
    'TUS',
    'Pía',
    'Medbot',
    'Tilo',
    'Desarrollo de software y hardware personalizado',
  ]
  const jakaruUrl = 'https://jakaru-pora-front.vercel.app/#/'

  for (const device of [
    { name: 'celular', width: 390, height: 844, isMobile: true },
    { name: 'celular-compacto', width: 320, height: 640, isMobile: true },
    { name: 'escritorio', width: 1280, height: 900, isMobile: false },
  ]) {
    const page = await browser.newPage({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: 1,
      isMobile: device.isMobile,
      hasTouch: device.isMobile,
    })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto('http://localhost:4173/proyectos/', { waitUntil: 'networkidle' })
    await page.reload({ waitUntil: 'networkidle' })

    const cards = page.locator('.project-card')
    const names = await page.locator('.project-name').allTextContents()
    await page.waitForFunction(() => {
      const image = document.querySelector('.profile-image')
      return image?.complete && image.naturalWidth > 0
    })

    const jakaruButton = cards.nth(1).locator('.project-trigger')
    await jakaruButton.click()
    const jakaruExpanded = await jakaruButton.getAttribute('aria-expanded') === 'true'
    const jakaruDestination = await cards.nth(1).getByRole('link', { name: 'Ver proyecto' }).getAttribute('href')
    const jakaruAlt = await cards.nth(1).locator('.detail-figure img').getAttribute('alt')
    const jakaruStayedOnPage = page.url().endsWith('/proyectos/')
    if (device.name === 'celular') {
      await page.waitForTimeout(350)
      await page.screenshot({ path: 'captura-jakaru-celular.png', fullPage: true })
    }

    const developmentButton = cards.nth(6).locator('.project-trigger')
    await developmentButton.click()
    const jakaruCollapsedWhenDevelopmentOpened = await jakaruButton.getAttribute('aria-expanded') === 'false'
    const developmentExpanded = await developmentButton.getAttribute('aria-expanded') === 'true'
    const developmentSummary = await cards.nth(6).locator('.detail-description').textContent()
    const developmentImage = await cards.nth(6).locator('.detail-figure img').getAttribute('src')
    const developmentHasNoLink = await cards.nth(6).getByRole('link').count() === 0

    await developmentButton.focus()
    await page.keyboard.press('Space')
    const keyboardClosesAccordion = await developmentButton.getAttribute('aria-expanded') === 'false'
    await page.keyboard.press('Enter')
    const keyboardOpensAccordion = await developmentButton.getAttribute('aria-expanded') === 'true'

    for (const img of await page.locator('.thumb img').all()) await img.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollTo(0, 0))
    const result = await page.evaluate(() => ({
      viewport: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      projects: document.querySelectorAll('.project-list > li').length,
      projectNames: [...document.querySelectorAll('.project-name')].map((element) => element.textContent),
      detailPanels: document.querySelectorAll('.project-detail').length,
      contactNumber: document.querySelector('.contact-number')?.textContent,
      contactLinks: [...document.querySelectorAll('.contact-list a')].map((anchor) => anchor.href),
    }))
    await page.screenshot({ path: `captura-${device.name}-actualizada.png`, fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const reducedMotion = await page.locator('.project-detail').first().evaluate((element) => getComputedStyle(element).transitionDuration === '0s')

    console.log(JSON.stringify({
      device: device.name,
      status: response.status(),
      ...result,
      jakaruExpanded,
      jakaruDestination,
      jakaruAlt,
      jakaruStayedOnPage,
      jakaruCollapsedWhenDevelopmentOpened,
      developmentExpanded,
      developmentSummary,
      developmentImage,
      developmentHasNoLink,
      keyboardClosesAccordion,
      keyboardOpensAccordion,
      reducedMotion,
      errors,
    }, null, 2))

    const valid = response.status() === 200
      && result.pageWidth <= result.viewport
      && result.projects === 7
      && JSON.stringify(names) === JSON.stringify(expectedNames)
      && result.title === 'Agronautas y proyectos del equipo'
      && result.detailPanels === 7
      && result.contactNumber === '+54 9 379 472-5842'
      && result.contactLinks.includes('tel:+5493794725842')
      && result.contactLinks.includes('https://wa.me/5493794725842')
      && jakaruExpanded
      && jakaruDestination === jakaruUrl
      && jakaruAlt?.includes('imagen ilustrativa')
      && jakaruStayedOnPage
      && jakaruCollapsedWhenDevelopmentOpened
      && developmentExpanded
      && developmentSummary?.includes('aplicaciones, sistemas, dispositivos y robótica')
      && developmentImage === '/images/software.webp'
      && developmentHasNoLink
      && keyboardClosesAccordion
      && keyboardOpensAccordion
      && reducedMotion
      && errors.length === 0
    if (!valid) process.exitCode = 1
    await page.close()
  }
} finally {
  await browser.close()
}
