#!/usr/bin/env node

const
  puppeteer = require('puppeteer')
  ,sanitize = require("sanitize-filename")
  ,fs = require('fs')
  ,chalk = require('chalk')
;

process.chdir(__dirname);

let cfgFile = process.argv.length >= 3 ? process.argv[2] : 'photo-session';
let cfg = require(`./sessions/${cfgFile}.json`);
shoot(cfg);

async function shoot(cfg) {
  if (!("shootByViewport" in cfg))
    cfg.shootByViewport = false;
  
  let dirName = cfgFile + '@' + new Date().toISOString().replace(/:|\./g, '-');
  let dirPath = `./shots/${dirName}`;
  fs.mkdirSync(dirPath);
  console.log(`Session: ${chalk.bold(cfgFile)}`);
  console.log(`Shoots directory: ${chalk.bold(dirPath)}`);

  const browser = await puppeteer.launch();
  console.log(`Browser version: ${chalk.bold(await browser.version())}`);
  console.log(`User Agent: ${chalk.bold(await browser.userAgent())}`);
  
  const page = await browser.newPage();
  let startTime;
  let screenshotParams = {fullPage: true};

  if (cfg.shootByViewport) {
    startTime = process.hrtime();

    for (let vp of cfg.viewports) {
      await page.setViewport({ width: vp[0], height: vp[1] });
      console.log(chalk.bold(`Shooting fullscreen@${vp[0]}x${vp[1]}`));

      for (let url of cfg.URLs) {
        await page.goto(url);

        let pageTitle = await page.title();
        let filename = `${sanitize(pageTitle)}@${vp[0]}.jpg`;
        screenshotParams.path = `${dirPath}/${filename}`;
        console.log(`${pageTitle} (${chalk.grey(url)}) --> ${filename}`);
        
        await page.screenshot(screenshotParams);
      }
    }
    printElapsedTime(process.hrtime(startTime));
  }
  else {
    startTime = process.hrtime();
    
    for (let url of cfg.URLs) {
      console.log(chalk.bold(url));
      await page.goto(url);

      let pageTitle = await page.title();
        
      for (let vp of cfg.viewports) {
        await page.setViewport({ width: vp[0], height: vp[1] });

        let filename = `${sanitize(pageTitle)}@${vp[0]}.jpg`;
        screenshotParams.path = `${dirPath}/${filename}`;
        console.log(`${filename}`);
    
        await page.screenshot(screenshotParams);
      }
    }
    printElapsedTime(process.hrtime(startTime));
  }

  await browser.close();
}

function printElapsedTime(diff) {
  console.log(`Shooting time: ${chalk.bold(diff[0] + diff[1] / 1e9)}s`);
}