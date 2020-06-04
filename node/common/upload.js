const fs = require('fs')

/**
 * files 上传图片文件
 */
module.exports = (files) => {

  // 创建可读流
  const reader = fs.createReadStream(files['image']['path']);

  let fileName = `blog-${new Date().getTime()}${~~(Math.random() * 10000)}.${files['image']['type'].split('/')[1]}`

  let filePath = `./public/uploads/${fileName}`;

  let remotefilePath = `https://www.kangdong.site/uploads/${fileName}`;
  // let remotefilePath = `http://localhost:8888/uploads/${fileName}`;

  // 创建可写流
  const upStream = fs.createWriteStream(filePath);

  // 可读流通过管道写入可写流
  reader.pipe(upStream);

  return {
    remotefilePath,
    size: files.image.size
  }
}