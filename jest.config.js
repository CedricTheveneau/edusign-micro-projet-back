module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: [
   '**/tests/**/*.[jt]s?(x)',
   '**/?(*.)+(spec|test).[tj]s?(x)'
 ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
 };