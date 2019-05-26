const puppeteer = require('puppeteer')

let browser
let newPage

beforeAll(async () => {
  jest.setTimeout(90200);
  browser = await puppeteer.launch({headless: false})
  page = await browser.newPage()
  await page.goto('https://www.glassesusa.com')
  await page.waitFor(4000)
  await page.click('[class="dyWelcomePopup__noThanks"]') // закрываем баннер
  await page.waitFor(4000)
  await page.click('#page-header > div.headerMain__wrapHeader___64-Qc > div > div.wrapMainMenu__wrap___1VPZF > div > div.wrapMainMenu__boxMenu___3Kkan > div > div:nth-child(2) > a') //переходим в CP Sunglasses
})

afterAll(()=> {
  browser.close()
})

describe('On page load', () =>{

    test('TryOn page displays correctly', async () => {
      await page.waitFor(9000)
      await page.click('[value="tryOn"]')
      await page.waitFor(4000)
      const tryonMenu = await page.$eval('[data-test-name="tryOn"]', el => el ? true : false) // panel of try on
      const tryonList = await page.$eval('[data-test-name="grid"]', el => el ? true : false) // grid of products
      const uploadButton = await page.$eval('[data-test-name="uploadButton"]', el => el ? true : false) //upload picture button
      const listPictures = await page.$$('.slider-slide')

      expect(tryonMenu).toBe(true)
      if (tryonMenu == false)
        await page.screenshot({path: 'error.png'})
      expect(uploadButton).toBe(true)
      expect(tryonList).toBe(true)
      expect(listPictures.length).toBe(10)
    })

    test('Upload photo for tryOn', async () => {
      await page.click('[data-test-name="uploadButton"]')
      const elementHandle = await page.$('[data-test-name="tryOnFileInput"]')
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
})
