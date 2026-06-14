import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('root TypeScript project build', () => {
  it('compiles without errors so `npm run build` can succeed', () => {
    const projectRoot = process.cwd();
    const tscBin = resolve(
      projectRoot,
      'node_modules',
      'typescript',
      'bin',
      'tsc',
    );

    const result = spawnSync(
      process.execPath,
      [tscBin, '-p', resolve(projectRoot, 'tsconfig.json'), '--noEmit'],
      {
        cwd: projectRoot,
        encoding: 'utf-8',
      },
    );

    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;

    expect(output).not.toMatch(/error TS\d+:/);
    expect(result.status).toBe(0);
  }, 60_000);
});
