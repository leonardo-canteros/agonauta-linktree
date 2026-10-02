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
  const jakaruUrl = 'https://jakaru-pora-front.vercel.app/#/?section=propuesta'

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
    const imagesLoaded = await page.waitForFunction(() =>
      [...document.querySelectorAll('.thumb img')].every((img) => img.complete && img.naturalWidth > 0),
    )
    const jakaruLink = cards.nth(1).locator('.project-direct-link')
    const directHref = await jakaruLink.getAttribute('href')
    const [jakaruPage] = await Promise.all([
      page.waitForEvent('popup'),
      jakaruLink.click(),
    ])
    await jakaruPage.waitForLoadState('domcontentloaded')
    const directOpened = jakaruPage.url() === jakaruUrl
    await jakaruPage.close()

    const accordionButton = cards.nth(0).locator('.project-trigger')
    await accordionButton.click()
    const accordionOpens = await accordionButton.getAttribute('aria-expanded') === 'true'
    const cardClickStays = page.url().endsWith('/proyectos/')
    await accordionButton.click()
    const accordionCloses = await accordionButton.getAttribute('aria-expanded') === 'false'

    const modalTrigger = cards.nth(6).locator('.project-trigger')
    await modalTrigger.click()
    const dialog = page.getByRole('dialog')
    const modalVisible = await dialog.isVisible()
    const modalTitle = await page.locator('#project-modal-title').textContent()
    const closeButton = page.getByRole('button', { name: 'Cerrar' })
    const closeButtonFocused = await closeButton.evaluate((element) => document.activeElement === element)
    const modalGeometry = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height, viewportHeight: window.innerHeight }
    })
    await page.keyboard.press('Escape')
    const escapeCloses = await page.getByRole('dialog').count() === 0
    await page.waitForFunction(() => document.activeElement?.closest('.project-card.is-modal') !== null)
    const focusReturnsAfterEscape = await modalTrigger.evaluate((element) => document.activeElement === element)
    await modalTrigger.click()
    await page.getByRole('button', { name: 'Cerrar' }).click()
    const buttonCloses = await page.getByRole('dialog').count() === 0
    await page.waitForFunction(() => document.activeElement?.closest('.project-card.is-modal') !== null)
    const focusReturnsAfterButton = await modalTrigger.evaluate((element) => document.activeElement === element)

    for (const img of await page.locator('.thumb img').all()) await img.scrollIntoViewIfNeeded()
    const result = await page.evaluate(() => ({
      viewport: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      projects: document.querySelectorAll('.project-list > li').length,
      projectNames: [...document.querySelectorAll('.project-name')].map((element) => element.textContent),
      directLinks: [...document.querySelectorAll('.project-direct-link')].map((a) => a.href),
      detailPanels: document.querySelectorAll('.project-detail').length,
    }))
    await page.screenshot({ path: `captura-${device.name}.png`, fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const reducedMotion = await page.locator('.project-detail').first().evaluate((element) => getComputedStyle(element).transitionDuration === '0s')

    console.log(JSON.stringify({
      device: device.name,
      status: response.status(),
      ...result,
      imagesLoaded: Boolean(imagesLoaded),
      directHref,
      directOpened,
      accordionOpens,
      accordionCloses,
      cardClickStays,
      modalVisible,
      modalTitle,
      closeButtonFocused,
      modalGeometry,
      escapeCloses,
      focusReturnsAfterEscape,
      buttonCloses,
      focusReturnsAfterButton,
      reducedMotion,
      errors,
    }, null, 2))

    const valid = response.status() === 200
      && result.pageWidth <= result.viewport
      && result.projects === 7
      && JSON.stringify(names) === JSON.stringify(expectedNames)
      && result.title === 'Agronautas y proyectos del equipo'
      && JSON.stringify(result.directLinks) === JSON.stringify([jakaruUrl])
      && directHref === jakaruUrl
      && directOpened
      && result.detailPanels === 5
      && accordionOpens
      && accordionCloses
      && cardClickStays
      && modalVisible
      && modalTitle === 'Desarrollo de software y hardware a medida'
      && closeButtonFocused
      && modalGeometry.width <= result.viewport
      && modalGeometry.height <= modalGeometry.viewportHeight
      && escapeCloses
      && focusReturnsAfterEscape
      && buttonCloses
      && focusReturnsAfterButton
      && reducedMotion
      && errors.length === 0
    if (!valid) process.exitCode = 1
    await page.close()
  }
} finally {
  await browser.close()
}
