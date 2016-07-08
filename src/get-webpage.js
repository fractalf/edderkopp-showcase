#!/usr/bin/env node
import { log, config, Parser, download, WebCache } from 'edderkopp';
import minimist from 'minimist';

// Handle command line arguments
const argv = minimist(process.argv.slice(2));
if (argv.h || argv.help || !argv._.length) {
    console.log('Usage: ./' + __filename.split('/').pop() + ' <url>');
    process.exit(1);
}

// Log
//log.level = argv.l ? argv.l : 'verbose';

// Url
const url = argv._[0];

// Config
// config.dir(__dirname + '/../config');
const conf = config.get(url);

// Web cache
const wc = new WebCache();
// let wc = new WebCache(__dirname + '/../web-cache.json');

const html = wc.get(url);
if (html) {
    log.info('use cache')
    parse(html);
} else {
    log.info('download')
    download(url)
    .then(res => {
        wc.set(url, res.html);
        parse(res.html);
    })
    .catch(err => {
        log.error(err);
    });
}

function parse(html) {
    const parser = new Parser(html);
    const data = parser.getData(conf.pages.shops);
    log.info(data.shops.length);
    log.info(data.shops[0]);
}
