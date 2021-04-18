const axios = require('axios');
const { JSDOM } = require('jsdom');

class DigiPW {

    static async getPrice(procuct_identifier) {
        const url = `https://www.digitec.ch/de/s1/product/${procuct_identifier}`;
        const { data: html } = await axios.get(url, {
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            }
        });
        const dom = new JSDOM(html);
        const $ = (selector) => dom.window.document.querySelector(selector).textContent;
        const price = $('.ZZbx');
        return {
            date: new Date(),
            price: price
        }
    };
}
module.exports = DigiPW