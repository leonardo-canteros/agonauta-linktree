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
    const jakaruButton = cards.nth(1).locator('.project-trigger')
    await jakaruButton.click()
    const jakaruExpanded = await jakaruButton.getAttribute('aria-expanded') === 'true'
    const jakaruLink = cards.nth(1).getByRole('link', { name: 'Ver proyecto' })
    const jakaruDestination = await jakaruLink.getAttribute('href')
    const jakaruStayedOnPage = page.url().endsWith('/proyectos/')
    await jakaruButton.click()

    const developmentButton = cards.nth(6).locator('.project-trigger')
    await developmentButton.click()
    const developmentExpanded = await developmentButton.getAttribute('aria-expanded') === 'true'
    const developmentSummary = await cards.nth(6).locator('.detail-description').textContent()
    const developmentImage = await cards.nth(6).locator('.detail-figure img').getAttribute('src')

    const pageText = await page.locator('body').innerText()
    const phoneTextPresent = pageText.includes('+54 9 379 472-5842')
    const headerImageAbsent = await page.locator('.profile-image').count() === 0
    const headerIntroAbsent = !pageText.includes('Somos nueve')
    const illustrationTextAbsent = !/ilustrativ[ao]s?/i.test(pageText)
    const twitterTextAbsent = !/twitter/i.test(pageText)
    const callLink = page.locator('.contact-list a[href^="tel:"]')
    const callLinkAvailable = await callLink.count() === 1
    const callLinkLabel = await callLink.innerText()
    const callLinkDestination = await callLink.getAttribute('href')
    const contactLinks = await page.locator('.contact-list a').evaluateAll((links) => links.map((link) => ({
      text: link.innerText.replace('↗', '').trim(),
      href: link.href,
    })))

    const moreButton = cards.nth(6).getByRole('button', { name: 'Ver más' })
    await moreButton.click()
    const dialog = page.getByRole('dialog')
    const modalVisible = await dialog.isVisible()
    const modalTitle = await page.locator('#service-modal-title').textContent()
    const services = await page.locator('.service-modal-list li').allTextContents()
    const processDescription = await page.locator('.service-modal-process').textContent()
    const invitation = await page.locator('.service-modal-invitation').textContent()
    const modalImage = await page.locator('.service-modal-image img').getAttribute('src')
    const closeButton = page.getByRole('button', { name: 'Cerrar' })
    const closeButtonFocused = await closeButton.evaluate((element) => document.activeElement === element)
    const modalGeometry = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight }
    })
    const contactButtonInModal = await dialog.getByRole('link', { name: 'WhatsApp' }).getAttribute('href')
    if (device.name === 'celular') await page.screenshot({ path: 'captura-modal-desarrollo-mobile.png' })

    await page.keyboard.press('Escape')
    const escapeCloses = await page.getByRole('dialog').count() === 0
    await page.waitForFunction(() => document.activeElement?.classList.contains('more-button'))
    const focusReturnsAfterEscape = await moreButton.evaluate((element) => document.activeElement === element)
    const bodyScrollRestoredAfterEscape = await page.evaluate(() => document.body.style.overflow === '')

    await moreButton.click()
    await page.getByRole('button', { name: 'Cerrar' }).click()
    const buttonCloses = await page.getByRole('dialog').count() === 0
    await page.waitForFunction(() => document.activeElement?.classList.contains('more-button'))
    const focusReturnsAfterButton = await moreButton.evaluate((element) => document.activeElement === element)

    const result = await page.evaluate(() => ({
      viewport: window.innerWidth,
      pageWidth: document.documentElement.scrollWidth,
      title: document.querySelector('h1')?.textContent,
      projects: document.querySelectorAll('.project-list > li').length,
      detailPanels: document.querySelectorAll('.project-detail').length,
    }))
    await page.screenshot({ path: `captura-${device.name}-modal-actualizada.png`, fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const reducedMotion = await page.locator('.project-detail').first().evaluate((element) => getComputedStyle(element).transitionDuration === '0s')

    console.log(JSON.stringify({
      device: device.name,
      status: response.status(),
      ...result,
      projectNames: names,
      jakaruExpanded,
      jakaruDestination,
      jakaruStayedOnPage,
      developmentExpanded,
      developmentSummary,
      developmentImage,
      phoneTextPresent,
      headerImageAbsent,
      headerIntroAbsent,
      callLinkAvailable,
      callLinkLabel,
      callLinkDestination,
      illustrationTextAbsent,
      twitterTextAbsent,
      contactLinks,
      modalVisible,
      modalTitle,
      services,
      processDescription,
      invitation,
      modalImage,
      modalGeometry,
      closeButtonFocused,
      contactButtonInModal,
      escapeCloses,
      focusReturnsAfterEscape,
      bodyScrollRestoredAfterEscape,
      buttonCloses,
      focusReturnsAfterButton,
      reducedMotion,
      errors,
    }, null, 2))

    const valid = response.status() === 200
      && result.pageWidth <= result.viewport
      && result.projects === 7
      && result.detailPanels === 7
      && JSON.stringify(names) === JSON.stringify(expectedNames)
      && result.title === 'Agronautas y proyectos del equipo'
      && jakaruExpanded
      && jakaruDestination === jakaruUrl
      && jakaruStayedOnPage
      && developmentExpanded
      && developmentSummary?.includes('incluyendo aplicaciones, sistemas, dispositivos y robótica')
      && developmentImage === '/images/software.webp'
      && phoneTextPresent
      && headerImageAbsent
      && headerIntroAbsent
      && callLinkAvailable
      && callLinkLabel.includes('Llamar')
      && callLinkDestination === 'tel:+5493794725842'
      && illustrationTextAbsent
      && twitterTextAbsent
      && contactLinks.length === 2
      && contactLinks[0].text.includes('Llamar')
      && contactLinks[0].text.includes('+54 9 379 472-5842')
      && contactLinks[0].href === 'tel:+5493794725842'
      && contactLinks[1].text.includes('WhatsApp')
      && contactLinks[1].text.includes('+54 9 379 472-5842')
      && contactLinks[1].href === 'https://wa.me/5493794725842'
      && modalVisible
      && modalTitle === 'Desarrollamos ideas en software, hardware y robótica'
      && services.length === 3
      && services[0].includes('páginas web, aplicaciones, sistemas de gestión y herramientas digitales')
      && services[1].includes('dispositivos electrónicos, integración de sensores y prototipos')
      && services[2].includes('mecanismos, automatización y prototipos')
      && processDescription?.toLowerCase().includes('conversamos sobre la necesidad')
      && invitation === '¿Tenés una idea? Conversemos sobre cómo llevarla adelante.'
      && modalImage === '/images/software.webp'
      && modalGeometry.width <= modalGeometry.viewportWidth
      && modalGeometry.height <= modalGeometry.viewportHeight
      && closeButtonFocused
      && contactButtonInModal === 'https://wa.me/5493794725842'
      && escapeCloses
      && focusReturnsAfterEscape
      && bodyScrollRestoredAfterEscape
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
