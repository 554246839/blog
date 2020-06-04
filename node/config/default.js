let env = process.argv[2]

const CONFIG = {
  PORT: 8888,
  TIMEOUT: 10000,

  MYSQL: {
    DATABASE: '',
    USERNAME: '',
    PASSWORD: '',
    PORT: '',
    HOST: ''
  },

  MONGO: {
    // HOST: '127.0.0.1',
    HOST: '',
    PORT: '',
    DATABASE: '',
    USERNAME: '',
    PASSWORD: ''
  },

  REDIS: {
    // HOST: '127.0.0.1',
    HOST: '',
    PORT: '',
    PASSWORD: '',
    TTL: 60 * 60 * 24,
    PREFIX: 'SAM:',
    FAMILY: 4
  },

  EMAIL: {
    FROM: '',
    PASS: '',
    SERVICE: 'qq',
    HOST: 'smtp.qq.com',
    PORT: 465
  }
}

module.exports = CONFIG;