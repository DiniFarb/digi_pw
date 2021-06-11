const { Telegraf } = require('telegraf');
const DigiPW = require('./digipw');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

let samples = [
    'lenovo-v50s-07imb-intel-core-i7-10700-16gb-512gb-1tb-ssd-hdd-pc-14393611',
    'ultimaker-2-connect-plus-air-manager-3d-drucker-15339619',
    'lenovo-v50s-intel-core-i5-10400-8gb-1tb-hdd-pc-14082589',
    'lenovo-thinkcentre-m90t-intel-core-i9-10900-32gb-1000gb-ssd-pc-14674994'
]
let products = [];

bot.command('add', async(ctx) => {
    try {
        pID = ctx.message.text.split(' ')[1];
        console.log(products.filter(pr => pr.id === pID).length);
        if (products.filter(pr => pr.id === pID).length === 0) {
            let p = await DigiPW.getPrice(pID);
            products.push(p);
            ctx.reply(`Preis: ${p.price}, wird iz überwacht..`);
        } else ctx.reply(`Wird scho überwacht...`);
    } catch (err) {
        console.log(err);
        ctx.reply(`öbis isch ni guet.. `);
    }
});

bot.command('list', (ctx) => {
    console.log("list")
    products.forEach(p => {
        ctx.reply(`P: ${p.id}\n Preis:${p.price}\n lastUpdate:${p.date}`);
    })
})


setInterval(() => {

}, 1000 * 3600 * 2);

function getPrices() {
    products.forEach(product => {
        DigiPW.getPrice(product.name).then(res => {
            if (products[product.name].price !== res.price) {
                products[product.name] = res;
                bot.telegram.sendMessage(process.env.CHAT_ID, `Change for: ${product.name}\n From: ${products[product.name].price}\n From: ${res.price}`);
            };
        }).catch(err => console.log(err));
    });
}
getPrices();