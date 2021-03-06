const t = require('tap')
const { real: mockNpm } = require('../../fixtures/mock-npm')

t.test('should throw in global mode', async (t) => {
  const { Npm } = mockNpm(t)
  const npm = new Npm()
  await npm.load()
  npm.config.set('global', true)
  t.rejects(
    npm.exec('dedupe', []),
    { code: 'EDEDUPEGLOBAL' },
    'throws EDEDUPEGLOBALE'
  )
})

t.test('should remove dupes using Arborist', async (t) => {
  t.plan(5)
  const { Npm } = mockNpm(t, {
    '@npmcli/arborist': function (args) {
      t.ok(args, 'gets options object')
      t.ok(args.path, 'gets path option')
      t.ok(args.dryRun, 'gets dryRun from user')
      this.dedupe = () => {
        t.ok(true, 'dedupe is called')
      }
    },
    '../../lib/utils/reify-finish.js': (npm, arb) => {
      t.ok(arb, 'gets arborist tree')
    },
  })
  const npm = new Npm()
  await npm.load()
  npm.config.set('prefix', 'foo')
  npm.config.set('dry-run', 'true')
  await npm.exec('dedupe', [])
})

t.test('should remove dupes using Arborist - no arguments', async (t) => {
  t.plan(1)
  const { Npm } = mockNpm(t, {
    '@npmcli/arborist': function (args) {
      t.ok(args.dryRun, 'gets dryRun from config')
      this.dedupe = () => {}
    },
    '../../lib/utils/reify-output.js': () => {},
    '../../lib/utils/reify-finish.js': () => {},
  })
  const npm = new Npm()
  await npm.load()
  npm.config.set('prefix', 'foo')
  npm.config.set('dry-run', true)
  await npm.exec('dedupe', [])
})
