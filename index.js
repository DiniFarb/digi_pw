const axios = require('axios');
const { JSDOM } = require('jsdom');
const products = [
    'lenovo-v50s-07imb-intel-core-i7-10700-16gb-512gb-1tb-ssd-hdd-pc-14393611',
    'ultimaker-2-connect-plus-air-manager-3d-drucker-15339619',
    'lenovo-v50s-intel-core-i5-10400-8gb-1tb-hdd-pc-14082589',
    'lenovo-thinkcentre-m90t-intel-core-i9-10900-32gb-1000gb-ssd-pc-14674994'
]

async function getPrice(procuct_identifier) {
    const url = `https://www.digitec.ch/de/s1/product/${procuct_identifier}`;
    const { data: html } = await axios.get(url, {
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        }
    });
    const dom = new JSDOM(html);
    const $ = (selector) => dom.window.document.querySelector(selector).textContent;
    const price = $('.ZZbx');
    console.log(price);
};

products.forEach(product => {
    getPrice(product);
});