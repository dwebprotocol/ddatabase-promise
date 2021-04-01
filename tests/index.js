const test = require('tape')
const ddatabasePromise = require('..')
const ddatabase = require('ddatabase')
const ram = require('random-access-memory')
const tempy = require('tempy')

test('default ddatabase', async function (t) {
  t.plan(4)

  const dir = tempy.directory()

  t.comment(`Creating a feed in: ${dir}`)
  const feed = ddatabasePromise(dir, { valueEncoding: 'utf-8' })

  await feed.ready()
  t.ok(Buffer.isBuffer(feed.key), 'Feed is ready and has a key')

  const seq = await feed.append('foo')
  t.equal(await feed.get(seq), 'foo')
  t.equal(await feed.head(), 'foo')

  const msg = await new Promise(resolve => {
    const stream = feed.createReadStream()
    stream.on('data', (msg) => {
      resolve(msg)
    })
  })
  t.equal(msg, 'foo')
})

test('set an external ddatabase instance', async function (t) {
  t.plan(1)

  const _feed = ddatabase(ram)
  const feed = ddatabasePromise(_feed)
  await feed.ready()
  t.equal(_feed._storage, feed._storage)
})

test('cache methods', async function (t) {
  t.plan(1)

  const feed = ddatabasePromise(ram)
  t.equal(feed.ready, feed.ready, 'Should get the same function')
})
