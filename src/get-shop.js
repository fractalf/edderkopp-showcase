#!/usr/bin/env node
// import { config, Parser, download, logger } from 'edderkopp';
import { config, Parser, download, logger, WebCache } from '../../edderkopp/dist';
import minimist from 'minimist';
import winston from 'winston';

// Handle command line arguments
const argv = minimist(process.argv.slice(2));
if (argv.h || argv.help || !argv._.length) {
    console.log('Usage: ./' + __filename.split('/').pop() + ' <url>');
    process.exit(1);
}

// Init log
const log = logger.logConsole;
log.activate('verbose');

// Get config based on url
const url = argv._[0];
// config.dir(__dirname + '/../config');
const conf = config.get(url);

// Use web cache
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
    // log.info(data.shops);
}
