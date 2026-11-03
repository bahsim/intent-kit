import { spawnSync } from 'node:child_process'
import { lstat, realpath } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

const junkNames = new Set(['__pycache__', '.DS_Store', 'node_modules', '.pytest_cache'])

export const isJunk = (name) => junkNames.has(name) || name.endsWith('.pyc')
export const toPosix = (path) => path.split(sep).join('/')

export async function statOrNull(path) {
  try {
    return await lstat(path)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

// Resolves a project-relative path, refusing to pass through a symlinked or non-directory parent.
export async function resolveDestination(targetRoot, targetPath) {
  if (!targetPath || isAbsolute(targetPath)) throw new Error('Destination must be a relative path')
  const destination = resolve(targetRoot, targetPath)
  const fromRoot = relative(targetRoot, destination)
  if (fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error('Destination escapes the project root')
  }
  let parent = targetRoot
  for (const segment of relative(targetRoot, destination).split(sep).slice(0, -1)) {
    parent = join(parent, segment)
    const parentStat = await statOrNull(parent)
    if (!parentStat) break
    if (parentStat.isSymbolicLink()) throw new Error(`Refusing to write through a target symlink: ${parent}`)
    if (!parentStat.isDirectory()) throw new Error(`Target path is not a directory: ${parent}`)
  }
  const info = await statOrNull(destination)
  if (info && (info.isSymbolicLink() || !info.isFile())) {
    throw new Error(`Target destination is not a regular file: ${targetPath}`)
  }
  return destination
}

export async function assertGitRepository(path) {
  let root
  try {
    root = await realpath(path)
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Target does not exist: ${path}`)
    throw error
  }
  if (!(await lstat(root)).isDirectory()) throw new Error(`Target is not a directory: ${root}`)
  const result = spawnSync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' })
  if (result.error) throw new Error(`Git is required but could not be run: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`Target is not inside a local Git repository: ${root}`)
  return { root, repositoryRoot: result.stdout.trim() }
}
