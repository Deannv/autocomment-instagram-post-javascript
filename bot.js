const puppeteer = require('puppeteer');
const { accounts, comments } = require('./resources.json');
const sleep = ms => new Promise(res => setTimeout(res, ms));

async function comment(username, password, postUrl, comment) {

    const browser = await puppeteer.launch({ headless: false }); // Change to true to run the process in background
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');

    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');


    await page.waitForNavigation();
    await page.goto(postUrl);
    await page.waitForSelector('textarea[placeholder="Add a comment…"]');

    await page.type('textarea[placeholder="Add a comment…"]', comment);
    await page.keyboard.press('Enter');

    await sleep(3000);

    await browser.close();
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

const postUrl = 'change with post URL';


async function postCommentsSequentially(accounts, postUrl, comments) {
    for (const account of accounts) {
        try {
            const com = randomChoice(comments);
            await comment(account.username, account.password, postUrl, com);
            console.log('Comment posted successfully for', account.username);
        } catch (error) {
            console.error('Error posting comment for', account.username, ':', error);
        }
    }
}

postCommentsSequentially(accounts, postUrl, comments)
    .then(() => console.log('All comments posted successfully'))
    .catch(error => console.error('Error posting comments:', error));


