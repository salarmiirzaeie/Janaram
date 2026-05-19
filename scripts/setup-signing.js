const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const keystoreSource = path.join(projectRoot, "@salarmiirzapour__Janaram.jks");
const androidDir = path.join(projectRoot, "android");
const keystoreTarget = path.join(
  androidDir,
  "app",
  "@salarmiirzapour__Janaram.jks"
);

console.log("🔐 Setting up signing configuration...");

// Check if keystore exists
if (!fs.existsSync(keystoreSource)) {
  console.error(`❌ Keystore not found at: ${keystoreSource}`);
  process.exit(1);
}

// Ensure android/app directory exists
if (!fs.existsSync(path.join(androidDir, "app"))) {
  console.error(`❌ Android/app folder not found. Run prebuild first.`);
  process.exit(1);
}

// Copy keystore
console.log(`📁 Copying keystore to: ${keystoreTarget}`);
fs.copyFileSync(keystoreSource, keystoreTarget);
console.log("✅ Keystore copied");

console.log("\n✅ Signing keystore ready!");
console.log(
  "📝 Remember to add signing config to android/app/build.gradle manually"
);
