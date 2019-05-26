const puppeteer = require('puppeteer')

let browser
let newPage

beforeAll(async () => {

  jest.setTimeout(90200);
  browser = await puppeteer.launch({headless: false})
  page = await browser.newPage()
  await page.goto('https://www.glassesusa.com')
  page.waitForSelector('[class="dyWelcomePopup__noThanks"]')
  await page.click('[class="dyWelcomePopup__noThanks"]') // closing the banner
  await page.click('[class="menuItem__item___qvTgX"]:nth-child(2) > a') //navigating to CP Sunglasses
})

afterAll(()=> {

  browser.close()
})

describe('On page load', () =>{

    test('TryOn page displays correctly', async () => {
      await page.waitForSelector('[value="tryOn"]')
      await page.click('[value="tryOn"]')
      await page.waitFor('[data-test-name="tryOn"]')
      const tryonMenu = await page.$eval('[data-test-name="tryOn"]', el => el ? true : false) // try on panel
      await page.waitFor('[data-test-name="grid"]')
      const tryonList = await page.$eval('[data-test-name="grid"]', el => el ? true : false) // grid of products
      await page.waitFor('[data-test-name="uploadButton"]')
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
      await page.waitFor('[data-test-name="tryOnButton"]')
      await page.click('[data-test-name="tryOnButton"]')
      await page.waitFor(4000)
      const listPictures = await page.$$('.slider-slide')

      expect(listPictures.length).toBe(11)
      if (listPictures.length == 10)
        await page.screenshot({path: 'upload_error.png'})
      await page.screenshot({path: 'screen_end.png'})
    })
})
