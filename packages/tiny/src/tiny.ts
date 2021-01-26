/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import ora from 'ora';
import * as path from 'path';
import tinify from 'tinify';
import { version } from '../package.json';
import Key from './key';
import questions from './question';

const program = require('commander');
const chalk = require('chalk');

const tinyPicReg = /\.(jpg|jpeg|png)$/;

let spinner = null;

program
  .version(version, '-v, --version', '获取版本')
  .option('-f, --force', '是否覆盖')
  .option('-i, --imgs [imgs...]', '自定义想要压缩的图片img')
  .parse(process.argv);

const key = new Key();
const apiKey = key.getKey();
tinify.key = apiKey;

apiKey ? validateKey() : inquireKey();

/**
 * 验证key
 */
async function validateKey() {
  try {
    await key.validateKey();
    start();
  } catch (error) {
    console.log(chalk.red(error));
    inquireKey();
  }
}
/**
 * 请求用户输入key
 */
function inquireKey() {
  inquirer
    .prompt(questions)
    .then(async answers => {
      // 将获取到的APIKey写入文件
      const filePath = path.join(path.resolve(process.execPath, '..'), 'tinyKey.txt');
      tinify.key = answers.APIKey;
      key.apiKey = answers.APIKey;
      await writeFilePromise(filePath, answers.APIKey, validateKey);
    })
    .catch(error => {
      if (error.isTtyError) {
        throw 'Prompt could not be rendered in the current environment';
      } else {
        throw error;
      }
    });
}

function start() {
  if (program.imgs && program.imgs.length) {
    // 压缩指定文件
    tiny(program.imgs);
  } else {
    // 压缩所有文件
    const files = readCurDir(process.cwd());
    tiny(files);
  }
}

function tiny(files: Array<string>) {
  const imgFiles = files.filter(item => {
    if (tinyPicReg.test(item)) return item;
  });
  const length = imgFiles.length;
  if (!length) {
    return console.log(chalk.grey('没有图片文件(●ˇ∀ˇ●)'));
  }

  // 进度条
  spinner = ora('开始压缩...').start();

  const folder = process.cwd();
  imgFiles.forEach(async (item, index) => {
    const curPath = path.join(folder, item);
    const res = await readFilePromise(curPath);
    res && tinyPromise(res, curPath, index === length - 1);
  });
}

function tinyPromise(file, filePath, isLast) {
  return new Promise((resolve, reject) => {
    const originFileStat = file.length;
    tinify.fromBuffer(file).toBuffer(async (err, res) => {
      if (err) {
        return reject(err);
      }

      await writeFilePromise(filePath, res, () => {
        console.log(
          chalk.green(
            `${filePath} 压缩成功! 原大小: ${getfilesize(originFileStat)}, 压缩后大小：${getfilesize(res.length)}`
          )
        );
      });
      resolve(true);
      if (isLast) {
        spinner.succeed('全部压缩任务完成！');
      }
    });
  }).catch(e => {
    // console.log(chalk.red('压缩出错-' + e))
    spinner.fail('压缩出错');
    throw new Error(e);
  });
}

/**
 * @description 读取文件
 * @param {string} filePath
 * @returns
 */
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  }).catch(e => {
    console.log(chalk.red('读取文件出错-' + e));
  });
}

/**
 * @description 写文件
 * @param {string} filePath
 * @param {buffer} content
 * @param {function} cb
 */
function writeFilePromise(filePath: string, content: Uint8Array, cb) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => {
      if (err) {
        return reject(err);
      }
      cb && cb();
      resolve(true);
    });
  }).catch(e => {
    console.log(chalk.red('写入文件出错:' + e));
  });
}

/**
 * @param {string} filePath
 * @description 读取当前文件夹下所有文件【遇到目录不读取】
 */
function readCurDir(filePath) {
  return fs.readdirSync(filePath);
}

/**
 * @description 获取文件大小
 * @param {number} size
 */
function getfilesize(size) {
  if (!size) return '';
  const num = 1024.0; //byte
  if (size < num) return size + 'B';
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'K'; //kb
  if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + 'M'; //M
  if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + 'G'; //G
  return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
}
