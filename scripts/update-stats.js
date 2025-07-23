#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Count lines of code
function countLinesOfCode(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let totalLines = 0
  let fileCount = 0

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath)
    
    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        walkDir(filePath)
      } else if (stat.isFile() && extensions.includes(path.extname(file))) {
        const content = fs.readFileSync(filePath, 'utf8')
        const lines = content.split('\n').length
        totalLines += lines
        fileCount++
      }
    }
  }

  walkDir(dir)
  return { totalLines, fileCount }
}

// Update stats
const projectRoot = path.join(__dirname, '..')
const stats = countLinesOfCode(projectRoot)

const statsFile = path.join(projectRoot, 'PROJECT_STATS.md')
const content = `# Project Statistics

Last Updated: ${new Date().toISOString()}

## Code Metrics
- Total Files: ${stats.fileCount}
- Total Lines of Code: ${stats.totalLines.toLocaleString()}
- Average Lines per File: ${Math.round(stats.totalLines / stats.fileCount)}

## Commit History
- Total Commits: ${fs.readdirSync(path.join(projectRoot, '.git', 'objects', 'info')).length}
`

fs.writeFileSync(statsFile, content)
console.log('✅ Project statistics updated!')