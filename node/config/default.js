let env = process.argv[2]

const CONFIG = {
  PORT: 8888,
  TIMEOUT: 10000,

  MYSQL: {
    DATABASE: 'test',
    USERNAME: 'root',
    PASSWORD: 'kd123456',
    PORT: '3306',
    HOST: 'localhost'
  },

  MONGO: {
    // HOST: '127.0.0.1',
    HOST: '112.74.50.222',
    PORT: '27017',
    DATABASE: 'blog',
    USERNAME: 'admin',
    PASSWORD: 'kd@123456'
  },

  REDIS: {
    // HOST: '127.0.0.1',
    HOST: '112.74.50.222',
    PORT: '6379',
    PASSWORD: 'kd@123456',
    TTL: 60 * 60 * 24,
    PREFIX: 'SAM:',
    FAMILY: 4
  },

  EMAIL: {
    FROM: '554246839@qq.com',
    PASS: 'hhfjmogcdmarbfbg',
    SERVICE: 'qq',
    HOST: 'smtp.qq.com',
    PORT: 465
  }
}

module.exports = CONFIG;