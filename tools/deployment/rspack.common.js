const { DefinePlugin } = require('@rspack/core');

function commonRulesRsPack(config) {
  const module = config.module || {};
  module.rules = module.rules || [];
  module.rules = module.rules.filter(
    (rule) => !(rule.test && rule.test.toString().includes('.scss'))
  );

  module.rules.push({
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    type: 'asset/resource',
    generator: {
      filename: 'assets/[name][ext]',
    },
  });
  module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/, // For fonts
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name][ext]',
    },
  });
  module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  module.rules.push({
    test: /\.scss$/i,
    use: [
      'style-loader', // Injects CSS into the DOM
      'css-loader', // Resolves CSS imports
      'sass-loader', // Compiles SCSS to CSS
    ],
  });

  config.plugins.push(
    new DefinePlugin({
      'process.env.NX_PUBLIC_API_BASE': JSON.stringify(
        process.env.NX_PUBLIC_API_BASE
      ),
    })
  );
  return config;
}

module.exports = commonRulesRsPack;
