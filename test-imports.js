#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`)
}

function runCommand(command, description, options = {}) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : ['pipe', 'pipe', 'pipe']
    }).trim()
    return { success: true, output }
  } catch (error) {
    return { success: false, output: error.message }
  }
}

function main() {
  log('🔍 VALIBOT IMPORT RESOLUTION TEST SUITE', 'blue')
  log('=' .repeat(50), 'blue')
  
  // Test 1: Check all built package imports
  log('\n📦 TEST 1: Built Package Imports Overview', 'bold')
  log('Command: grep -r "from.*valibot" packages/*/dist/', 'yellow')
  
  const test1 = runCommand('grep -r "from.*valibot" packages/*/dist/ | head -10', 'Test 1')
  if (test1.success) {
    const lines = test1.output.split('\n')
    const cleanImports = lines.filter(line => line.includes('from "valibot"')).length
    const mangledImports = lines.filter(line => line.includes('node_modules')).length
    
    log(`✅ Found ${lines.length} total valibot imports`)
    log(`✅ Clean imports: ${cleanImports}`, cleanImports > 0 ? 'green' : 'red')
    log(`${mangledImports > 0 ? '❌' : '✅'} Mangled imports: ${mangledImports}`, mangledImports > 0 ? 'red' : 'green')
    
    if (mangledImports > 0) {
      log('\n🚨 MANGLED IMPORTS FOUND:', 'red')
      lines.filter(line => line.includes('node_modules')).forEach(line => {
        log(`  ${line}`, 'red')
      })
    }
  } else {
    log('❌ Test 1 failed to run', 'red')
  }

  // Test 2: Check specific problem file
  log('\n🎯 TEST 2: Specific Problem File Check', 'bold')
  log('Command: cat packages/chain/dist/chain/shared.js | grep "from.*valibot"', 'yellow')
  
  const problemFile = 'packages/chain/dist/chain/shared.js'
  if (existsSync(problemFile)) {
    const test2 = runCommand(`cat ${problemFile} | grep "from.*valibot"`, 'Test 2')
    if (test2.success && test2.output) {
      const hasMangled = test2.output.includes('node_modules')
      log(`${hasMangled ? '❌' : '✅'} ${problemFile}:`, hasMangled ? 'red' : 'green')
      log(`  ${test2.output}`, hasMangled ? 'red' : 'green')
    } else {
      log('✅ No valibot imports found in problem file', 'green')
    }
  } else {
    log('⚠️  Problem file does not exist', 'yellow')
  }

  // Test 3: Source vs Built comparison
  log('\n🔄 TEST 3: Source vs Built Comparison', 'bold')
  
  const sourceFile = 'packages/chain/src/chain/shared.ts'
  const builtFile = 'packages/chain/dist/chain/shared.js'
  
  log('Source file check:', 'yellow')
  if (existsSync(sourceFile)) {
    const sourceTest = runCommand(`grep "from.*valibot" ${sourceFile}`, 'Source test', { silent: true })
    if (sourceTest.success && sourceTest.output) {
      const isClean = !sourceTest.output.includes('node_modules')
      log(`  ${isClean ? '✅' : '❌'} ${sourceFile}: ${sourceTest.output}`, isClean ? 'green' : 'red')
    } else {
      log('  ℹ️  No valibot imports in source', 'blue')
    }
  } else {
    log('  ⚠️  Source file not found', 'yellow')
  }

  log('Built file check:', 'yellow')
  if (existsSync(builtFile)) {
    const builtTest = runCommand(`grep "from.*valibot" ${builtFile}`, 'Built test', { silent: true })
    if (builtTest.success && builtTest.output) {
      const isClean = !builtTest.output.includes('node_modules')
      log(`  ${isClean ? '✅' : '❌'} ${builtFile}: ${builtTest.output}`, isClean ? 'green' : 'red')
    } else {
      log('  ℹ️  No valibot imports in built file', 'blue')
    }
  } else {
    log('  ⚠️  Built file not found', 'yellow')
  }

  // Test 4: Node resolution test
  log('\n🔍 TEST 4: Node Resolution Test', 'bold')
  
  // Check if we're in test-playground or main repo
  const isInTestPlayground = process.cwd().includes('test-playground')
  const testPlaygroundPath = isInTestPlayground 
    ? process.cwd() 
    : '/Users/niconiahi/Documents/repos/test-playground'

  if (existsSync(testPlaygroundPath)) {
    log('Testing direct valibot resolution:', 'yellow')
    const directTest = runCommand(`cd ${testPlaygroundPath} && node -e "console.log(require.resolve('valibot'))"`, 'Direct valibot resolution')
    if (directTest.success) {
      log(`✅ Direct valibot resolves to: ${directTest.output}`, 'green')
    } else {
      log(`❌ Direct valibot resolution failed: ${directTest.output}`, 'red')
    }

    log('Testing mangled path resolution:', 'yellow')
    const mangledPath = path.join(testPlaygroundPath, 'node_modules/@ethernauta/chain/dist/node_modules/.pnpm/valibot@1.1.0_typescript@5.8.3/node_modules/valibot/dist/index.js')
    const mangledTest = runCommand(`node -e "console.log(require.resolve('${mangledPath}'))"`, 'Mangled path resolution', { silent: true })
    if (mangledTest.success) {
      log(`⚠️  Mangled path unexpectedly resolves: ${mangledTest.output}`, 'yellow')
    } else {
      log(`✅ Mangled path correctly fails to resolve`, 'green')
    }
  } else {
    log('⚠️  Test playground not found, skipping resolution tests', 'yellow')
  }

  // Summary
  log('\n📊 SUMMARY', 'bold')
  log('=' .repeat(30), 'blue')
  
  // Quick health check
  const overallTest = runCommand('grep -r "node_modules.*valibot" packages/*/dist/ 2>/dev/null || echo "no-mangled-imports"', 'Overall health check', { silent: true })
  const hasMangledImports = overallTest.success && !overallTest.output.includes('no-mangled-imports')
  
  if (hasMangledImports) {
    log('❌ ISSUE DETECTED: Found mangled valibot imports in built packages', 'red')
    log('   Next steps: Investigate tsdown configuration and build process', 'red')
  } else {
    log('✅ LOOKING GOOD: No mangled imports detected', 'green')
    log('   All valibot imports appear to use clean "valibot" specifiers', 'green')
  }

  // Configuration info
  log('\n⚙️  CURRENT CONFIGURATION', 'bold')
  const configs = ['packages/eth/tsdown.config.ts', 'packages/transport/tsdown.config.ts', 'packages/chain/tsdown.config.ts']
  configs.forEach(configPath => {
    if (existsSync(configPath)) {
      const configTest = runCommand(`grep -A 1 "external:" ${configPath}`, 'Config check', { silent: true })
      if (configTest.success) {
        log(`📝 ${configPath}:`, 'blue')
        log(`   ${configTest.output.replace(/\n/g, ' ')}`, 'blue')
      }
    }
  })

  log('\n🏁 Test completed!', 'bold')
}

main()