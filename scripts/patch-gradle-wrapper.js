const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
  __dirname,
  "../android/gradle/wrapper/gradle-wrapper.properties"
);

if (!fs.existsSync(filePath)) {
  console.log("❌ gradle-wrapper.properties not found");
  process.exit(0);
}

let content = fs.readFileSync(filePath, "utf8");

// replace Gradle distribution URL
content = content.replace(
  /distributionUrl=https\\:\/\/services.gradle.org\/distributions\/gradle-8\.13-bin\.zip/,
  "distributionUrl=https\\://maven.myket.ir/gradle/distributions/gradle-8.13-bin.zip"
);

fs.writeFileSync(filePath, content);

console.log("✅ Gradle wrapper switched to Myket distribution");
