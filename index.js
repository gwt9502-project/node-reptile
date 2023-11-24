#!/usr/bin/env node
const cluster = require('node:cluster')
const download = require('./download')
const cpuNums = require('node:os').cpus().length

const allPage = 10
let curPage = 0
let images = []

// 是否是主进程
if (cluster.isPrimary) {
  cluster.setupPrimary({
    exec: 'worker.js',
    args: ['--use', 'https'],
  })

  for (let i = 0; i < Math.min(allPage, cpuNums); i++) {
    const worker = cluster.fork()
    curPage++
    worker.send(curPage)

    worker.on('message', (data) => {
      images = [...images, ...JSON.parse(data)]
      curPage++
      if (curPage > allPage) {
        worker.disconnect()
        if (!Object.keys(cluster.workers).length) {
          cluster.disconnect()
          download(images)
        }
      } else {
        worker.send(curPage)
      }
    })
  }

  cluster.on('fork', (worker) => {
    console.log(`cluster fork worker ${worker.process.pid} \n`)
  })

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0) {
      cluster.fork()
    } else {
      console.log(`子进程 ${worker.process.pid} 关闭`)
    }
  })
}
