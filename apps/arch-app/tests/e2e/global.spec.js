const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function example() {
    // 配置 Chrome 选项
    let options = new chrome.Options();
    
    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
    
    try {
        await driver.get('https://www.google.com');
        
        let searchBox = await driver.findElement(By.name('q'));
        await searchBox.sendKeys('webdriver', Key.RETURN);
        
        // 使用更灵活的等待条件
        await driver.wait(
            async () => {
                let title = await driver.getTitle();
                return title.includes('webdriver') && title.includes('Google');
            },
            20000,
            '等待标题超时'
        );
        
        console.log('✅ Chrome 测试成功！');
        
    } finally {
        await driver.quit();
    }
})();