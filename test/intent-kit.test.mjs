import { execFileSync, spawnSync } from 'node:child_process'
import { chmod, cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { bundles, kitFiles } from '../src/kit.mjs'

const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillPath = '.github/skills/meta-plan/SKILL.md'

async function temporaryDirectory(t) {
  const path = await mkdtemp(join(tmpdir(), 'intent-kit-test-'))
  t.after(() => rm(path, { recursive: true, force: true }))
  return path
}

async function repository(t) {
  const target = await temporaryDirectory(t)
  execFileSync('git', ['init', '--quiet', target])
  return target
}

async function copyKit(t) {
  const copy = await temporaryDirectory(t)
  for (const entry of ['package.json', 'bin', 'src', 'skills', 'instructions', 'resources']) {
    await cp(join(kitRoot, entry), join(copy, entry), { recursive: true })
  }
  return copy
}

function run(command, target, { args = [], kit = kitRoot, cwd = target ?? kitRoot } = {}) {
  return spawnSync(process.execPath, [join(kit, 'bin/intent-kit.mjs'), command,
    ...(target ? ['--target', target] : []), ...args], { cwd, encoding: 'utf8' })
}

function assertOk(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
}

async function writeTarget(target, path, contents) {
  await mkdir(dirname(join(target, path)), { recursive: true })
  await writeFile(join(target, path), contents)
}

async function listFiles(root, current = root) {
  const files = []
  for (const entry of await readdir(current, { withFileTypes: true })) {
    if (entry.name === '.git') continue
    const path = join(current, entry.name)
    if (entry.isDirectory()) files.push(...await listFiles(root, path))
    else files.push(relative(root, path).split('\\').join('/'))
  }
  return files.sort()
}

function assertLinks(text, base, label) {
  for (const [, link] of text.replace(/```[\s\S]*?```/g, '').matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
    if (!/^[a-z][a-z0-9+.-]*:/i.test(link)) assert.ok(existsSync(resolve(base, link)), `${label} -> ${link}`)
  }
}

test('help and version work without a target; removed commands are rejected', () => {
  const help = run('--help')
  assertOk(help)
  assert.match(help.stdout, /install/)
  assert.doesNotMatch(help.stdout, /\b(status|doctor|keep|unkeep)\b/)
  assert.doesNotMatch(help.stdout, /--dry-run/)
  assertOk(run('--version'))
  assert.match(run('--version').stdout.trim(), /^3\.\d+\.\d+$/)
  for (const command of ['status', 'doctor', 'keep', 'unkeep']) {
    const result = run(command)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Unknown command/)
  }
})

test('kit bundles, skill frontmatter, documentation links, and package contents are consistent', async () => {
  for (const kind of ['skills', 'instructions', 'resources']) {
    const names = Object.values(bundles).flatMap((bundle) => bundle[kind])
    assert.equal(new Set(names).size, names.length, `${kind}: each entry belongs to one bundle`)
    assert.deepEqual((await readdir(join(kitRoot, kind))).sort(), [...names].sort())
  }
  for (const name of Object.values(bundles).flatMap((bundle) => bundle.skills)) {
    const text = await readFile(join(kitRoot, 'skills', name, 'SKILL.md'), 'utf8')
    assert.match(text, new RegExp(`^---\\r?\\nname: ${name}\\r?\\n`))
    assert.match(text, /\ndescription: ./)
  }
  for (const path of (await listFiles(kitRoot)).filter((path) => path.endsWith('.md'))) {
    assertLinks(await readFile(join(kitRoot, path), 'utf8'), dirname(join(kitRoot, path)), path)
  }
  for (const module of ['record', 'keep', 'status', 'doctor']) {
    assert.equal(existsSync(join(kitRoot, 'src', `${module}.mjs`)), false)
  }
  assert.equal(existsSync(join(kitRoot, 'payload')), false)
  assert.equal(existsSync(join(kitRoot, 'manifest.json')), false)
})

test('user guide covers every bundled skill and ships with the package', async () => {
  const guidePath = 'docs/agentic-approach/README.md'
  const guide = await readFile(join(kitRoot, guidePath), 'utf8')
  const readme = await readFile(join(kitRoot, 'README.md'), 'utf8')
  const pkg = JSON.parse(await readFile(join(kitRoot, 'package.json'), 'utf8'))
  assert.ok(pkg.files.includes('docs'))
  assert.ok(readme.includes(`./${guidePath}`))
  for (const skill of Object.values(bundles).flatMap((bundle) => bundle.skills)) {
    assert.ok(guide.includes(`../../skills/${skill}/SKILL.md`), `${skill} must have a procedure link`)
  }
  assert.doesNotMatch(guide, /pvm-waterfall|pnpm|PROPOSED PROCEDURE|CONCEPT AND PROPOSED ARCHITECTURE/)
})

const combinations = [
  [], ['e2e'], ['docs'], ['word'], ['design'], ['e2e', 'docs'], ['e2e', 'word'],
  ['docs', 'word'], ['design', 'e2e'], ['design', 'docs'], ['design', 'word'],
  ['e2e', 'docs', 'word'], ['all'],
]
for (const extras of combinations) {
  test(`install ${extras.join(',') || 'core'}: exact files and bytes, links resolve, no record or scaffold`, async (t) => {
    const target = await repository(t)
    assertOk(run('install', target, { args: extras.length ? ['--with', extras.join(',')] : [] }))
    const names = ['core', ...(extras.includes('all')
      ? Object.keys(bundles).filter((name) => name !== 'core')
      : extras)]
    const expected = await kitFiles(names, '.github/skills')
    assert.deepEqual(await listFiles(target), expected.map((file) => file.targetPath).sort())
    for (const file of expected) {
      assert.deepEqual(await readFile(join(target, file.targetPath)), await readFile(file.sourcePath))
      if (file.targetPath.endsWith('.md')) {
        const text = await readFile(join(target, file.targetPath), 'utf8')
        assertLinks(text, dirname(join(target, file.targetPath)), file.targetPath)
        assert.doesNotMatch(text, /\b(pnpm|PVM|pvm-waterfall|Databricks|TanStack|Vitest)\b/)
      }
    }
  })
}

test('removed dry-run option is rejected without copying files', async (t) => {
  const target = await repository(t)
  await writeTarget(target, skillPath, 'local edit')
  const result = run('install', target, { args: ['--dry-run', '--with', 'all'] })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Unknown argument: --dry-run/)
  assert.deepEqual(await listFiles(target), [skillPath])
  assert.equal(await readFile(join(target, skillPath), 'utf8'), 'local edit')
})

test('install copies every selected file, including pre-existing, identical, and locally edited files', async (t) => {
  const target = await repository(t)
  await writeTarget(target, skillPath, 'pre-existing customization')
  const first = run('install', target)
  assertOk(first)
  assert.match(first.stdout, new RegExp(`COPIED ${skillPath}`))
  const original = await readFile(join(kitRoot, 'skills/meta-plan/SKILL.md'))
  assert.deepEqual(await readFile(join(target, skillPath)), original)
  const second = run('install', target)
  assertOk(second)
  assert.match(second.stdout, new RegExp(`COPIED ${skillPath}`))
  assert.deepEqual(await readFile(join(target, skillPath)), original)
  await writeTarget(target, skillPath, 'another local edit')
  assertOk(run('install', target))
  assert.deepEqual(await readFile(join(target, skillPath)), original)
  assert.equal(existsSync(join(target, `${skillPath}.kit-new`)), false)
})

test('relocated kit updates files without records, leaving unrelated files and old artifacts untouched', async (t) => {
  const target = await repository(t)
  assertOk(run('install', target))
  const copy = await copyKit(t)
  await writeTarget(copy, 'skills/meta-plan/SKILL.md', 'updated kit skill')
  for (const path of ['app.txt', '.github/intent-kit.json', '.meta/intent-kit/install-record.json', `${skillPath}.kit-new`]) {
    await writeTarget(target, path, 'existing file')
  }
  assertOk(run('install', target, { kit: copy }))
  assert.equal(await readFile(join(target, skillPath), 'utf8'), 'updated kit skill')
  for (const path of ['app.txt', '.github/intent-kit.json', '.meta/intent-kit/install-record.json', `${skillPath}.kit-new`]) {
    assert.equal(await readFile(join(target, path), 'utf8'), 'existing file')
  }
})

test('bundle choices are per run: unselected bundles are neither updated nor deleted', async (t) => {
  const target = await repository(t)
  assertOk(run('install', target, { args: ['--with', 'e2e'] }))
  const path = '.github/skills/meta-e2e/SKILL.md'
  await writeTarget(target, path, 'custom browser skill')
  assertOk(run('install', target))
  assert.equal(await readFile(join(target, path), 'utf8'), 'custom browser skill')
  assertOk(run('install', target, { args: ['--with', 'e2e'] }))
  assert.deepEqual(await readFile(join(target, path)), await readFile(join(kitRoot, 'skills/meta-e2e/SKILL.md')))
})

test('default target uses repository root; --target supports a selected subproject', async (t) => {
  const target = await repository(t)
  const child = join(target, 'packages/app')
  await mkdir(child, { recursive: true })
  assertOk(run('install', undefined, { cwd: child }))
  assert.ok(existsSync(join(target, skillPath)))
  assert.equal(existsSync(join(child, skillPath)), false)
  assertOk(run('install', child))
  assert.ok(existsSync(join(child, skillPath)))
})

test('custom skills directory is honored but not remembered', async (t) => {
  const target = await repository(t)
  assertOk(run('install', target, { args: ['--skills-dir', '.claude/skills'] }))
  assert.ok(existsSync(join(target, '.claude/skills/meta-plan/SKILL.md')))
  assert.equal(existsSync(join(target, skillPath)), false)
  assertOk(run('install', target))
  assert.ok(existsSync(join(target, skillPath)))
})

test('invalid options, bundles, targets, and escaping destinations fail explicitly', async (t) => {
  const target = await repository(t)
  for (const args of [
    ['--unknown'], ['--with'], ['--with', 'bad'], ['--with', 'all,bad'],
    ['--with', ','], ['--with', 'e2e,', 'docs'], ['--skills-dir', '../outside'],
    ['--skills-dir', '/outside'], ['--skills-dir', '.'],
  ]) {
    const result = run('install', target, { args })
    assert.equal(result.status, 1, JSON.stringify(args))
    assert.match(result.stderr, /intent-kit:/)
  }
  assert.deepEqual(await listFiles(target), [])
  const outside = await temporaryDirectory(t)
  assert.match(run('install', outside).stderr, /not inside a local Git repository/)
  assert.match(run('install', join(outside, 'missing'), { cwd: outside }).stderr, /Target does not exist/)
})

test('destination symlinks and non-regular files fail before any install writes', async (t) => {
  for (const kind of ['parent', 'file', 'directory']) {
    const target = await repository(t)
    const outside = await temporaryDirectory(t)
    if (kind === 'parent') await symlink(outside, join(target, '.github'), 'dir')
    else {
      await mkdir(dirname(join(target, skillPath)), { recursive: true })
      if (kind === 'file') {
        await writeTarget(outside, 'protected.txt', 'protected')
        await symlink(join(outside, 'protected.txt'), join(target, skillPath))
      } else await mkdir(join(target, skillPath))
    }
    const result = run('install', target)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /symlink|not a regular file/)
    assert.equal(existsSync(join(target, '.meta/instructions')), false)
    if (kind === 'file') assert.equal(await readFile(join(outside, 'protected.txt'), 'utf8'), 'protected')
  }
})

test('junk is excluded and missing selected sources fail before copying', async (t) => {
  const copy = await copyKit(t)
  await writeTarget(copy, 'skills/meta-plan/__pycache__/cache.pyc', 'junk')
  await writeTarget(copy, 'skills/meta-plan/.DS_Store', 'junk')
  const target = await repository(t)
  assertOk(run('install', target, { kit: copy }))
  assert.equal((await listFiles(target)).some((path) => /__pycache__|\.pyc$|\.DS_Store/.test(path)), false)
  await rm(join(copy, 'skills/meta-plan'), { recursive: true })
  const fresh = await repository(t)
  const result = run('install', fresh, { kit: copy })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /incomplete/)
  assert.deepEqual(await listFiles(fresh), [])
})

test('install copies files regardless of Git ignore rules, without diagnostics', async (t) => {
  const target = await repository(t)
  await writeTarget(target, '.gitignore', '.github/\n.meta/\n')
  const result = run('install', target)
  assertOk(result)
  assert.equal(result.stderr, '')
  assert.ok(existsSync(join(target, skillPath)))
})

test('copy failures are surfaced explicitly', async (t) => {
  if (process.getuid?.() === 0) {
    t.skip('Root bypasses file permissions')
    return
  }
  const target = await repository(t)
  await writeTarget(target, skillPath, 'read-only file')
  await chmod(join(target, skillPath), 0o444)
  const result = run('install', target)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /intent-kit:.*EACCES/)
})
