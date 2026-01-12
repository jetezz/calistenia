import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildType = process.argv[2] || 'apk';

const androidDir = join(__dirname, 'android');
const isWindows = platform() === 'win32';
const gradlewPath = isWindows
  ? join(androidDir, 'gradlew.bat')
  : './gradlew';
const command = buildType === 'aab'
  ? `"${gradlewPath}" bundleRelease`
  : `"${gradlewPath}" assembleDebug`;

try {
  console.log(`Building ${buildType.toUpperCase()}...`);
  execSync(command, {
    cwd: androidDir,
    stdio: 'inherit',
    shell: true
  });
  console.log(`\n✓ ${buildType.toUpperCase()} built successfully!`);

  if (buildType === 'apk') {
    console.log('\nAPK location: android/app/build/outputs/apk/debug/app-debug.apk');
  } else {
    console.log('\nAAB location: android/app/build/outputs/bundle/release/app-release.aab');
  }
} catch (error) {
  console.error(`\n✗ Build failed: ${error.message}`);
  process.exit(1);
}
