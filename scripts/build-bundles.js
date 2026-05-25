import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const variants = [
  { name: "myket", envFile: ".env.myket", runtimeVersion: "myket-1.2.4" },
  { name: "bazaar", envFile: ".env.bazaar", runtimeVersion: "bazaar-1.2.4" },
];

const SERVER_UPDATES_PATH =
  "/Users/salar/Documents/Projects/janaram-next/public/updates";

console.log("📦 Building OTA bundles for Myket and Bazaar...\n");

for (const variant of variants) {
  console.log(`🔨 Building for ${variant.name}...`);

  const outputDir = path.join(__dirname, "..", `dist-${variant.name}`);
  const serverDir = path.join(SERVER_UPDATES_PATH, variant.runtimeVersion);

  // Clean previous builds
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  // Export the bundle
  console.log(
    `   Running: dotenv -e ${variant.envFile} npx expo export --platform android --output-dir ${outputDir}`
  );

  try {
    execSync(
      `dotenv -e ${variant.envFile} npx expo export --platform android --output-dir ${outputDir}`,
      {
        stdio: "inherit",
        timeout: 120000,
      }
    );
    console.log(`   ✅ Export complete for ${variant.name}`);
  } catch (error) {
    console.log(`   ⚠️  Export had issues, but continuing...`);
  }

  // Wait a moment for files to be written
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check multiple possible locations for exported files
  let sourcePath = null;
  const possiblePaths = [
    outputDir,
    path.join(outputDir, "dist"),
    path.join(__dirname, "..", "dist"),
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath) && fs.readdirSync(testPath).length > 0) {
      sourcePath = testPath;
      console.log(`   Found files at: ${testPath}`);
      break;
    }
  }

  if (sourcePath) {
    // Create server directory
    fs.mkdirSync(serverDir, { recursive: true });

    // Copy all files to server
    fs.cpSync(sourcePath, serverDir, { recursive: true });

    // Create expoConfig.json
    const expoConfig = {
      name: "جانارام",
      slug: "Janaram",
      version: "1.2.4",
      runtimeVersion: variant.runtimeVersion,
      platforms: ["android"],
      orientation: "portrait",
      scheme: "janaram",
      extra: {
        appVariant: variant.name,
      },
    };

    fs.writeFileSync(
      path.join(serverDir, "expoConfig.json"),
      JSON.stringify(expoConfig, null, 2)
    );

    console.log(`   ✅ Copied to: ${serverDir}`);
    console.log(`   ✅ Created expoConfig.json`);

    // Verify files
    const files = fs.readdirSync(serverDir);
    console.log(`   📁 Contents: ${files.join(", ")}`);
  } else {
    console.log(`   ❌ No files found for ${variant.name}`);
    console.log(`   Checked paths: ${possiblePaths.join(", ")}`);
  }

  console.log("");
}

console.log("🎉 Process complete!");
console.log("\n📍 Check server locations:");
console.log(`   ls -la ${SERVER_UPDATES_PATH}/myket-1.2.4/`);
console.log(`   ls -la ${SERVER_UPDATES_PATH}/bazaar-1.2.4/`);
