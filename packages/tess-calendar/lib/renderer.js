const puppeteer = require('puppeteer');

class Renderer {

    async init(options) {
        this.browser = await puppeteer.launch(options);
    }

    async createPage(html) {
        const page = await this.browser.newPage()
        await page.setContent(html);
        return page
    }
    async pageToPng(html, options = { fullPage: true }) {
        let page = null
        try {
            page = await this.createPage(html)
            const buffer = await page.screenshot(options);
            
            return buffer;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }
    
    async close() {
        await this.browser.close()
    }
}

module.exports = Renderer;