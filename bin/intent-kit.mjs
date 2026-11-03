#!/usr/bin/env node

import { install } from '../src/install.mjs'
import { kitVersion, normalizeSkillsDir, optionalBundles, parseBundleList } from '../src/kit.mjs'
import { assertGitRepository } from '../src/util.mjs'

const usage = `intent-kit <command> [options]

Commands:
  install   Install or upgrade the workflow skills in a Git repository

Options:
  --target <path>       Project directory (default: the Git repository containing the current directory)
  --with <bundles>      install: add optional bundles (${optionalBundles.join(', ')}, all); core is always installed
  --skills-dir <path>   install: skills directory relative to the project (default: .github/skills)
  --help, --version

Selected kit files are overwritten, including local edits.`

function parseArgs(args) {
  const [command, ...rest] = args
  const options = { command, requestedBundles: [] }
  const takesValue = new Set(['--target', '--with', '--skills-dir'])
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]
    if (takesValue.has(arg)) {
      const value = rest[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`)
      index += 1
      if (arg === '--target') options.target = value
      else if (arg === '--skills-dir') options.skillsDir = normalizeSkillsDir(value)
      else options.requestedBundles.push(...parseBundleList(value))
    } else throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    console.log(usage)
    return
  }
  if (args.includes('--version') || args[0] === 'version') {
    console.log(await kitVersion())
    return
  }

  const options = parseArgs(args)
  if (options.command !== 'install') {
    throw new Error(`Unknown command: ${options.command}\n\n${usage}`)
  }
  const { root, repositoryRoot } = await assertGitRepository(options.target ?? process.cwd())
  const targetRoot = options.target ? root : repositoryRoot

  await install({
    targetRoot,
    requestedBundles: options.requestedBundles,
    skillsDir: options.skillsDir,
  })
}

main().catch((error) => {
  console.error(`intent-kit: ${error.message}`)
  process.exitCode = 1
})
