module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          'root': ['./'], 
          'alias': {
            '@src': './src',
            '@assets': './assets',
            '@data': './src/data',
            '@components': './src/components'
          }
        }
      ]
    ]
  };
};

// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       [
//         'module-resolver',
//         {
//           "root": ["./"],
//           "alias": {
//             "@components": "./src/components",
//             "@data": "./src/data",
//           }
//         }
//       ]
//     ]
//   };
// };
