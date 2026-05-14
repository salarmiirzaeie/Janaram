const { withAppBuildGradle, createRunOncePlugin } = require("@expo/config-plugins");

const withMyketBilling = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") return config;

    let contents = config.modResults.contents;

    // prevent double injection
    if (contents.includes("myket-billing-client")) {
      return config;
    }

    // add manifest placeholders (your existing logic)
    contents = contents.replace(
      /defaultConfig\s*{/,
      `defaultConfig {
          manifestPlaceholders = [
              marketApplicationId: "ir.mservices.market",
              marketBindAddress: "ir.mservices.market.InAppBillingService.BIND",
              marketPermission: "ir.mservices.market.BILLING"
          ]
  `,
    );

    // 🔥 IMPORTANT FIX: remove Poolakey from classpath
    if (!contents.includes("exclude group: 'com.github.cafebazaar'")) {
      contents = contents.replace(
        /dependencies\s*{/,
        `dependencies {
            configurations.all {
                exclude group: "com.github.cafebazaar"
                exclude group: "com.github.cafebazaar.Poolakey"
            }
        `,
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = createRunOncePlugin(withMyketBilling, "with-myket-billing", "1.0.0");
