import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, posix, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isJunk, statOrNull, toPosix } from './util.mjs'

export const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const defaultSkillsDir = '.github/skills'
export const instructionsDir = '.meta/instructions'
export const resourcesDir = '.meta/scripts'

// Each bundle lists kit folders by kind. A kit folder belongs to exactly one bundle.
export const bundles = {
  core: {
    skills: ['meta-init', 'meta-project-context', 'meta-plan', 'meta-epic', 'meta-deliver', 'meta-testing'],
    instructions: ['how-to-log-a-backlog-item.md'],
    resources: [],
  },
  e2e: {
    skills: ['meta-e2e'],
    instructions: [],
    resources: [],
  },
  docs: {
    skills: ['meta-business-documentation'],
    instructions: ['how-to-audit-documentation.md'],
    resources: [],
  },
  word: {
    skills: ['meta-word-extract'],
    instructions: [],
    resources: ['word-extraction'],
  },
}

export const optionalBundles = Object.keys(bundles).filter((name) => name !== 'core')

export async function kitVersion() {
  const { version } = JSON.parse(await readFile(join(kitRoot, 'package.json'), 'utf8'))
  return version
}

export function normalizeSkillsDir(value) {
  const normalized = posix.normalize(toPosix(value).replace(/\/+$/, ''))
  if (!value || normalized.startsWith('/') || normalized === '.' || normalized.split('/').includes('..')) {
    throw new Error(`--skills-dir must be a relative path inside the project: ${value}`)
  }
  return normalized
}

export function parseBundleList(value) {
  const requested = value.split(',').map((name) => name.trim()).filter(Boolean)
  const unknown = requested.filter((name) => name !== 'all' && !optionalBundles.includes(name))
  if (unknown.length > 0) {
    throw new Error(`Unknown bundle(s): ${unknown.join(', ')}. Optional bundles: ${optionalBundles.join(', ')}, all`)
  }
  if (requested.length === 0) throw new Error('--with requires at least one bundle')
  return requested.includes('all') ? optionalBundles : requested
}

async function walk(sourcePath, targetPath, files) {
  const info = await statOrNull(sourcePath)
  if (!info) throw new Error(`The kit is incomplete; missing ${toPosix(sourcePath)}`)
  if (info.isSymbolicLink()) throw new Error(`Kit symlinks are not supported: ${sourcePath}`)
  if (info.isDirectory()) {
    for (const entry of (await readdir(sourcePath)).sort()) {
      if (!isJunk(entry)) await walk(join(sourcePath, entry), posix.join(targetPath, entry), files)
    }
  } else if (info.isFile()) {
    files.push({ sourcePath, targetPath })
  } else {
    throw new Error(`Unsupported kit entry: ${sourcePath}`)
  }
}

export async function kitFiles(bundleNames, skillsDir) {
  const files = []
  for (const name of bundleNames) {
    const bundle = bundles[name]
    for (const skill of bundle.skills) await walk(join(kitRoot, 'skills', skill), posix.join(skillsDir, skill), files)
    for (const file of bundle.instructions) await walk(join(kitRoot, 'instructions', file), posix.join(instructionsDir, file), files)
    for (const resource of bundle.resources) await walk(join(kitRoot, 'resources', resource), posix.join(resourcesDir, resource), files)
  }
  return files.sort((left, right) => left.targetPath.localeCompare(right.targetPath))
}
