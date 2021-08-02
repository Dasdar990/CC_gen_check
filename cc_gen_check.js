const fetch = require("node-fetch");
const puppeteer = require('puppeteer');
const fs = require('fs');

const pattern = new RegExp("(?=.{1,16}$)[0-9]{3,}.x{1,}")
const input = process.argv[2];


if (pattern.test(process.argv[2])) {
    (async() => {
        const browser = await puppeteer.launch({ headless: true });

        //NAMSO

        let page = await browser.newPage();
        await page.goto('https://namso-gen.com/');
        await page.waitForNavigation();

        await page.focus('input.form-input');
        await page.keyboard.type(input);
        await page.click('[type="submit"]');

        const element = await page.$(".form-textarea");
        let text = await page.evaluate(element => element.value, element);
        console.log("Cards generated, going to checker");
        await browser.close();

        text = text.split("\n");
        //CHECKER
        console.log("LIVE:")

        for (let key of text)
            fetch("https://www.mrchecker.net/card-checker//ccn2/api.php", {
                body: "data=" + key,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            }).then(response => response.json())
            .then(data => {
                if (data.error === 1) {
                    let cc = data.msg.substring(data.msg.indexOf('|') + 1)
                    cc = cc.substr(0, cc.indexOf('['))
                    console.log(cc.replace(/\s+/g, ''))
                }
            });

    })();
} else {
    console.log("Wrong parameter, pattern accepted: numbers+x");
}