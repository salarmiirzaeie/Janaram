const { withSettingsGradle, createRunOncePlugin } = require("@expo/config-plugins");

const withPoolakey = (config) => {
  // Modify settings.gradle
  config = withSettingsGradle(config, (config) => {
    if (!config.modResults.contents.includes("@cafebazaar/react-native-poolakey")) {
      config.modResults.contents += `\ninclude ':@cafebazaar_react-native-poolakey'\nproject(':@cafebazaar_react-native-poolakey').projectDir = new File(rootProject.projectDir, '../node_modules/@cafebazaar/react-native-poolakey/android')\n`;
    }
    return config;
  });

  return config;
};

module.exports = createRunOncePlugin(withPoolakey, "with-poolakey", "1.0.0");
