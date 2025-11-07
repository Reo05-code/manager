module.exports = {
  root: true,
  env: {
    browser: true, // ← これで window / document が使える
    node: true, // ← esbuild / Rails の Node実行でもエラー出ない
    es2021: true, // ← 最新構文に対応
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  rules: {
    // JSX を .js/.jsx どちらでも使えるようにする
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

    // React Function Component を arrow function で書けるようにする
    'react/function-component-definition': [
      1,
      { namedComponents: 'arrow-function' },
    ],

    // よく使うので console.log / alert を許可
    'no-console': 0,
    'no-alert': 0,

    // export が1つのファイルでデフォルトを強制されるのを無効化（好み）
    'import/prefer-default-export': 0,
  },
};
