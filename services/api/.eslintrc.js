module.exports = {
  ...require('@marry-tone/eslint-config/nestjs'),
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
}
