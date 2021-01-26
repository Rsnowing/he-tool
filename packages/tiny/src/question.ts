export default [
  {
    type: 'input',
    name: 'APIKey',
    message: '请输入tinypng的APIKey,获取链接https://tinypng.com/developers:',
    validate: function (APIKey: string): boolean | string {
      if (APIKey === '') {
        return '请输入APIKey~';
      }
      return true;
    }
  }
];
