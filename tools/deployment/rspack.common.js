const { DefinePlugin } = require('@rspack/core');

function commonRulesRsPack(config, isDevelopment = false) {
  const module = config.module || {};
  module.rules = module.rules || [];
  module.rules = module.rules.filter(
    (rule) => !(rule.test && rule.test.toString().includes('.scss'))
  );

  // Optimized asset handling with caching
  module.rules.push({
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    type: 'asset/resource',
    generator: {
      filename: isDevelopment ? 'assets/[name][ext]' : 'assets/[name].[contenthash:8][ext]',
    },
  });
  
  module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    type: 'asset/resource',
    generator: {
      filename: isDevelopment ? 'fonts/[name][ext]' : 'fonts/[name].[contenthash:8][ext]',
    },
  });

  // Optimized CSS handling for development vs production
  if (isDevelopment) {
    // Fast CSS processing for development
    module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag', // Faster injection
          },
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: false, // Disable source maps for CSS in dev for speed
          },
        },
      ],
    });

    module.rules.push({
      test: /\.scss$/i,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag',
          },
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
            sassOptions: {
              outputStyle: 'expanded', // Faster than compressed
            },
          },
        },
      ],
    });
  } else {
    // Production CSS processing
    module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    module.rules.push({
      test: /\.scss$/i,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    });
  }

  // Add performance optimizations for development
  if (isDevelopment) {
    // Optimize module resolution (only supported options)
    config.resolve = {
      ...config.resolve,
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        ...config.resolve?.alias,
        // Add common aliases to speed up resolution
        '@': 'src',
      },
    };
    
    // Optimize chunk splitting for development
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
      moduleIds: 'named',
      chunkIds: 'named',
    };
  }

  config.plugins.push(
    new DefinePlugin({
      'process.env.NX_PUBLIC_API_BASE': JSON.stringify(
        process.env.NX_PUBLIC_API_BASE
      ),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    })
  );
  
  return config;
}

module.exports = commonRulesRsPack;
