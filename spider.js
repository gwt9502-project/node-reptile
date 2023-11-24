#!/usr/bin/env node
const axios = require('axios')
const cheerio = require('cheerio')

const baseUrl = 'https://e-shuushuu.net'

function spider(page) {
  return axios(`${baseUrl}?page=${page}`, { responseType: 'text' }).then(
    (res) => {
      const $ = cheerio.load(res.data)
      const data = []
      $('#content .image_thread .thumb_image').each(function (index) {
        data[index] = $(this).attr('href')
      })
      return data
    }
  )
}

module.exports = {
  baseUrl,
  spider,
}
