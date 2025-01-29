/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2024-05-20T21:05:10+02:00
 * @Copyright: Technology Studio
 */

import { expect } from 'expect'
import { getState } from 'jest-circus'
import { v5 as uuid } from 'uuid'
import * as path from 'path'
import { configManager } from '@txo-peer-dep/test-automation-seed'
import type { SeedExecutor } from '@txo-peer-dep/test-automation-seed'

const getDescribeTitle = (): string => {
  const state = getState()
  const describeTitles: string[] = []
  let currentDescribeBlock: typeof state.currentDescribeBlock | undefined = state.currentDescribeBlock

  while (currentDescribeBlock != null) {
    describeTitles.unshift(currentDescribeBlock.name)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- we want to directly access parent and set it
    currentDescribeBlock = currentDescribeBlock.parent
  }

  return describeTitles.join(' ')
}

export const getTestTitle = (): string => {
  const testTitle = expect.getState().currentTestName ?? getDescribeTitle()
  return testTitle
}

export const getTestFilePath = (): string => {
  const { testPath: testFilePath } = expect.getState()

  if (testFilePath == null) {
    throw new Error('Test filepath not found')
  }

  const relativePath = path.relative(__dirname, testFilePath)
  return relativePath.replace(/^(\.\.\/)*/, '')
}

export const getTestRidge = (): string => getTestTitle() + getTestFilePath()

export const seedEntities = async <ASSETS> (
  seedExecutor: SeedExecutor<ASSETS>,
): Promise<ASSETS> => {
  const fingerprint = uuid(configManager.config.getRidge() + getTestRidge(), '1b671a64-40d5-491e-99b0-da01ff1f3341')

  return await seedExecutor.execute(fingerprint)
}

configManager.update({
  seedEntities,
})
