#!/usr/bin/env node
const axios = require('axios')
const asnyc = require('async')
const fs = require('fs')
const http = require('http')
const https = require('https')
const { join } = require('path')
const { baseUrl } = require('./spider')

const imagesPath = join(process.cwd(), './images/')

function downloadField(url = '', callback) {
  const fileName = url.split('/').slice(-1)[0]
  console.log(`图片: ${fileName} 开始下载`)
  axios(baseUrl + url, {
    responseType: 'stream',
    timeout: 10000,
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  })
    .then((res) => {
      res.data.pipe(fs.createWriteStream(`./images/${fileName}`))
      console.log('\x1B[32m', `图片: ${fileName} 下载成功`)
      callback && callback(null, fileName)
    })
    .catch((error) => {
      console.log('\x1B[31m%s\x1B[0m', `图片: ${fileName} 下载失败`)
      callback && callback(error)
    })
}

module.exports = async (images) => {
  let imageDirExist = false
  try {
    imageDirExist = !!fs.readdirSync(imagesPath)
  } catch (error) {
    imageDirExist = false
  }
  if (!imageDirExist) {
    fs.mkdirSync(imagesPath)
  }
  asnyc.map(
    images,
    function (url, callback) {
      setTimeout(() => {
        downloadField(url, callback)
      }, 1000)
    },
    function (error, results) {
      if (error) {
        console.error(`download file error:${error}`)
      } else {
        console.log('\x1B[32m', `download ${results.length} file success`)
      }
    }
  )
}
