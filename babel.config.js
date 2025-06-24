// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    // La base pour tout projet Expo. C'est non négociable.
    presets: ['babel-preset-expo'],

    // Ceci est la ligne OBLIGATOIRE ajoutée par Reanimated.
    // Elle doit TOUJOURS être le dernier plugin de la liste.
    plugins: ['react-native-reanimated/plugin'],
  };
};