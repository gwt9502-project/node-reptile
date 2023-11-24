#!/usr/bin/env node
const cluster = require('node:cluster')
const { spider } = require('./spider')

if (cluster.isWorker) {
  process.on('message', async (page) => {
    console.log(`当前爬取第 ${page} 页`)
    try {
      const data = await spider(page)
      console.log(
        `子进程 ${process.pid} 成功爬取第 ${page} 页 ${data.length}条数据`
      )
      process.send(JSON.stringify(data))
    } catch (error) {
      console.log(error)
    }
  })
}
