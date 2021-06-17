const { Telegraf } = require('telegraf');
const DigiPW = require('./digipw');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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
    getPrices();
}, 1000 * 10);

function getPrices() {
    products.forEach((product, i) => {
        DigiPW.getPrice(product.id).then(res => {
            if (product.price !== res.price) {
                products[i] = res;
                bot.telegram.sendMessage(process.env.CHAT_ID, `Change for: ${product.id}\n From: ${products[product.name].price}\n From: ${res.price}`);
            } else {
                console.log(`${product.id} has not changed`)
            };
        }).catch(err => console.log(err));
    });
}