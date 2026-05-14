const { withAppBuildGradle, createRunOncePlugin } = require("@expo/config-plugins");

const withPoolakey = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") return config;

    let contents = config.modResults.contents;

    // prevent duplicate injection
    if (contents.includes("Poolakey")) {
      return config;
    }

    // 🔥 inject Poolakey + remove Myket
    contents = contents.replace(
      /dependencies\s*{/,
      `dependencies {
            implementation "com.github.cafebazaar.Poolakey:poolakey:2.2.0"

            configurations.all {
                exclude group: "com.github.myketstore"
                exclude group: "com.android.vending.billing"
            }
      `,
    );

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = createRunOncePlugin(withPoolakey, "with-poolakey", "1.0.0");
