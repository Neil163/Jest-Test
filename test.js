const puppeteer = require('puppeteer')

let browser
let newPage

beforeAll(async () => {
  jest.setTimeout(90200);
  browser = await puppeteer.launch({headless: true})
  page = await browser.newPage()
  await page.goto('https://www.glassesusa.com')

})

describe('On page load', () =>{

    test('Page dislpays correctly', async () => {
      await page.waitFor(4000)
      await page.click('[class="btn-closeWelcome mkt-x"]') // закрываем баннер
      await page.waitFor(4000)
      await page.click('#page-header > div.headerMain__wrapHeader___64-Qc > div > div.wrapMainMenu__wrap___1VPZF > div > div.wrapMainMenu__boxMenu___3Kkan > div > div:nth-child(2) > a') //переходим в CP Sunglasses
      await page.waitFor(4000)
      //const html = await page.$eval('.header__title___3klcB', e => e.innerHTML)
      const buttons = await page.$eval('.controls__container___34W4y', el => el ? true : false)

      //expect(html).toBe('Sunglasses Collection<span class=\"header__results___11gDe\">(978 items)</span>')
      expect(buttons).toBe(true)
    })

    test('TryOn page displays correctly', async () => {
      //await page.click('[class="btn-closeWelcome mkt-x"]')
      await page.click('[value="tryOn"]')
      await page.waitFor(4000)
      const tryonMenu = await page.$eval('.categoryPageTryon__wrap___103vW', el => el ? true : false)
      const tryonList = await page.$eval('.categoryList__wrapper___2FDxP', el => el ? true : false)
      const uploadButton = await page.$eval('.categoryPageTryon__information___2jhdi', el => el ? true : false)
      const listPictures = await page.$$('.slider-slide')

      expect(tryonMenu).toBe(true)
      if (tryonMenu == false)
        await page.screenshot({path: 'error.png'})
      expect(uploadButton).toBe(true)
      expect(tryonList).toBe(true)
      expect(listPictures.length).toBe(10)

    })

    test('Upload photo for tryOn', async () => {
      await page.click('[class="categoryPageTryon__information___2jhdi"]')
      await page.click('[class="categoryPageTryon__uploadButton___12QRW"]')
      const elementHandle = await page.$('.upload__uploadFileInput___2CTOo')
      await elementHandle.uploadFile('glasses.png')
      await page.waitFor(4000)
      await page.click('[data-test-name="tryOnButton"]')
      await page.waitFor(4000)
      const listPictures = await page.$$('.slider-slide')
      await page.waitFor(4000)

      expect(listPictures.length).toBe(11)
      if (listPictures.length == 10)
        await page.screenshot({path: 'upload_error.png'})

      await page.screenshot({path: 'screen_end.png'})
    })

  afterAll(()=> {
    //browser.close()
  })
})
