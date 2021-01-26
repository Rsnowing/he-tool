import * as fs from 'fs';
import * as path from 'path';
import tinify from 'tinify';

export default class Key {
  public apiKey: string;

  setApiKey(value: string): void {
    this.apiKey = value;
  }

  getKey(): string {
    if (this.apiKey) {
      return this.apiKey;
    }
    try {
      const filePath = path.resolve(process.execPath, '..') + '\\tinyKey.txt';
      this.setApiKey(fs.readFileSync(filePath, 'utf8'));
      tinify.key = this.apiKey;
      return this.apiKey;
    } catch (error) {
      return '';
    }
  }

  validateKey() {
    return new Promise((resolve, reject) => {
      tinify.validate(err => {
        if (err) {
          return reject('密钥校验失败，请重新输入-' + err);
        }
        resolve(true);
      });
    });
  }
}
