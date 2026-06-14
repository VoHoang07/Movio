import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const rootPackageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const mobilePackageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'mobile/package.json'), 'utf-8'),
) as {
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
};

describe('root mobile Expo scripts', () => {
  it('delegates Expo startup to the mobile project without invoking npx from the root', () => {
    expect(rootPackageJson.scripts?.mobile).toBe('cd mobile && npm run start');
    expect(rootPackageJson.scripts?.['mobile:clear']).toBe('cd mobile && npm run start:clear');
  });

  it('does not install expo in the web app root because the Expo app lives in mobile/', () => {
    expect(rootPackageJson.dependencies).not.toHaveProperty('expo');
    expect(rootPackageJson.devDependencies).not.toHaveProperty('expo');
  });

  it('keeps Expo installed and started from the mobile project package', () => {
    expect(mobilePackageJson.dependencies).toHaveProperty('expo');
    expect(mobilePackageJson.main).toBe('expo/AppEntry.js');
    expect(mobilePackageJson.scripts?.start).toBe('expo start');
    expect(mobilePackageJson.scripts?.['start:clear']).toBe('expo start -c');
  });

  it('does not expose root scripts that start Expo with the repository root as cwd', () => {
    const rootScripts = rootPackageJson.scripts ?? {};

    for (const [name, command] of Object.entries(rootScripts)) {
      if (name === 'mobile' || name === 'mobile:clear') {
        continue;
      }

      expect(command).not.toMatch(/\b(?:npx\s+)?expo\s+start\b/);
    }
  });

  it('provides a defensive root Expo App shim for accidental root launches', () => {
    const rootAppEntryPath = resolve(process.cwd(), 'App.tsx');

    expect(existsSync(rootAppEntryPath)).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'App.js'))).toBe(false);
    expect(readFileSync(rootAppEntryPath, 'utf-8').trim()).toBe(
      "export { default } from './mobile/App';",
    );
    expect(basename(resolve(process.cwd(), 'mobile/App.tsx'))).toBe('App.tsx');
  });

  it('does not leave Expo project state in the repository root', () => {
    expect(existsSync(resolve(process.cwd(), '.expo'))).toBe(false);
  });
});
