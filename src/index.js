const { Telegraf } = require('telegraf');
const DigiPW = require('./digipw');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.launch();

let products = [
    'lenovo-v50s-07imb-intel-core-i7-10700-16gb-512gb-1tb-ssd-hdd-pc-14393611',
    'ultimaker-2-connect-plus-air-manager-3d-drucker-15339619',
    'lenovo-v50s-intel-core-i5-10400-8gb-1tb-hdd-pc-14082589',
    'lenovo-thinkcentre-m90t-intel-core-i9-10900-32gb-1000gb-ssd-pc-14674994'
]

let prices = new Map();

bot.on('text', async(ctx) => {
    let text = ctx.message.text.toLocaleLowerCase();
    console.log(text);
    if (!text.startsWith('add')) {
        products.push(text.split(' ')[1]);
        let price = await DigiPW.getPrice(text.split(' ')[1]);
        ctx.reply(`Preis: ${price.price}`);
    }
    if (text === 'list') {
        prices.forEach((key, val) => {
            ctx.reply(`P: ${key}\n Preis:${val.price}`);
        })
    }
});

setInterval(() => {
    products.forEach(product => {
        let price = null;
        DigiPW.getPrice(product).then(res => {
            price = res;
            if (prices.has(product)) {
                console.log(price)
                let priceBefor = prices.get(product);
                if (price.price !== priceBefor.price) {
                    prices.set(product, price);
                    bot.telegram.sendMessage(process.env.CHAT_ID, `Preisänderung für:\n${product},\n${price.price}`);
                }
            } else {
                console.log(price)
                prices.set(product, price);
            }
        }).catch(err => console.log(err));
    })
}, 1000 * 10);