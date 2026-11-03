import { copyFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { resolveDestination } from './util.mjs'
import { defaultSkillsDir, kitFiles } from './kit.mjs'

export async function install({ targetRoot, requestedBundles = [], skillsDir = defaultSkillsDir }) {
  const files = await kitFiles([...new Set(['core', ...requestedBundles])], skillsDir)
  for (const file of files) {
    file.destination = await resolveDestination(targetRoot, file.targetPath)
  }
  for (const file of files) {
    await mkdir(dirname(file.destination), { recursive: true })
    await copyFile(file.sourcePath, file.destination)
    console.log(`COPIED ${file.targetPath}`)
  }
}
