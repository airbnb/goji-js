import webpack from 'webpack';
import Warning from 'postcss-loader/dist/Warning';

// this file is used to prevent webpack from throwing a warning when it encounters a serialization error
// this file should be removed when 3rd party libraries fix their serialization issues
webpack.util.serialization.registerNotSerializable(Warning);
