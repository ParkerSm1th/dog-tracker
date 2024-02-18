module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./app/tsconfig.json'], // Specify it only for TypeScript files
  },
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    '../.eslintrc.cjs',
  ],
  globals: {
    expect: true,
    browser: true,
    global: true,
  },
  ignorePatterns: [
    '/artifacts',
    '/build',
    '/dist',
    '*.config.js',
    '*.d.ts',
    '*.cjs',
  ],
  overrides: [
    // Typescript-specific rules that don't apply to our .[mc]js files.
    {
      files: [
        'app/**/*.ts*',
      ],
      rules: {
        '@typescript-eslint/semi': ['error'],
        // semi can give wrong results with TS but we enable the TS equivalent.
        semi: 'off',
      },
    },

    // TSX files
    {
      files: [
        'app/**/*.tsx',
      ],
      rules: {
        'max-lines': ['error', 210],
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
      },
    },

    // Storybook stories
    {
      files: [
        'app/**/*.stories.tsx',
      ],
      rules: {
        'react/function-component-definition': 'off',
        'react/no-multi-comp': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
      },
    },

    // Storybook stories and unit tests
    {
      files: [
        'app/**/*.stories.tsx',
        'app/**/*/*.unit.test.tsx',
      ],
      rules: {
        'max-lines': 'off',
      },
    },

    // All tests
    {
      files: [
        'app/**/*.test.ts',
      ],
      env: {
        jest: true,
      },
      rules: {
        // Using type assertions in tests is less problematic since the test will likely fail if the
        // assertion was wrong.
        '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
        'jest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      },
    },

    // UI tests
    {
      files: [
        'app/**/*.ui.test.ts',
      ],
      globals: {
        driver: true,
      },
    },

    // Scripts
    {
      files: ['scripts/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },

    // Background files
    {
      files: ['app/background/**/*'],
      rules: {
        'no-restricted-imports': 'off',
        'no-restricted-properties': [
          'error',
          {
            message:
              'There is no access to `document` available in MV3 extensions since the background runs in a Service Worker',
            object: 'document',
          },
          {
            message:
              'There is no access to `window` available in MV3 extensions since the background runs in a Service Worker. Check if `globalThis` has the property you need.',
            object: 'window',
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector:
              'CallExpression[callee.object.property.name="tabs"] > MemberExpression[property.name="sendMessage"]',
            message: 'Use our TS-friendly `notifyTab` or `notifyAllTabs` instead',
          },
          {
            selector:
              'MemberExpression[object.object.name="browser"][object.property.name="tabs"][property.name="onUpdated"]',
            message:
              'Subscribe to `tabChangeObservable` instead to guarantee that tab state was reset before the callback is called.',
          },
        ],
      },
    },

    // store-url.e2e.test.ts
    {
      files: [
        'app/e2e-tests/extension-stores/store-url.e2e.test.ts',
      ],
      rules: {
        // @jest-environment-options can't be parsed and eslint comments can't come before the Jest
        // docblock.
        'jsdoc/valid-types': 'off',
      },
    },

    // Content scripts
    {
      files: ['app/content-scripts/**/*'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector:
              'CallExpression[callee.name="getValueFromTabState"] Identifier[name="dropdown"]',
            message:
              'Avoid using `getValueFromTabState` to access dropdown state since it can be stale. Some properties written by content-scripts are mirrored in DropdownManager.',
          },
        ],
      },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'justinanastos',
    'import',
    'compat',
    'react',
    'react-hooks',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Want this enabled but too many existing violations to fix now.
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      args: 'after-used',
      ignoreRestSiblings: true,
      destructuredArrayIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    'constructor-super': 'error',
    curly: ['error', 'all'],
    'default-case': 'off',
    'import/default': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/blob/a752638f975935882746ee5ef614ca02f120675d/docs/getting-started/linting/FAQ.md
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-cycle': 'error',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'off',
    'jest/no-alias-methods': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'justinanastos/switch-braces': ['error'],
    'no-caller': 'error',
    'no-const-assign': 'error',
    'no-delete-var': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-keys': 'error',
    'no-else-return': 'warn',
    'no-empty': 'off',
    'no-empty-pattern': 'off',
    'no-extra-parens': 'off',
    'no-iterator': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': [1, 'smart-tabs'],
    'no-multi-str': 'warn',
    'no-new-wrappers': 'error',
    'no-plusplus': 'off',
    'no-proto': 'error',
    'no-restricted-syntax': [
      'error',
    ],
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-spaced-func': 'error',
    'no-this-before-super': 'error',
    // Use TypeScript for this instead:
    'no-undef': 'off',
    'no-undef-init': 'off',
    'no-unneeded-ternary': 'error',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-call': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'error',
    'no-useless-rename': 'warn',
    'no-var': 'warn',
    'no-with': 'error',
    'prefer-arrow-callback': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-spread': 'warn',
    'prefer-template': 'warn',
    'quote-props': [2, 'as-needed'],
    radix: 'warn', // parseInt(x, 10)
    'react/boolean-prop-naming': 'error',
    'react/display-name': ['warn', { ignoreTranspilerName: false }],
    'react/forbid-component-props': ['error', { forbid: ['class'] }],
    'react/jsx-handler-names': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    'react/jsx-no-bind': ['warn', {
      ignoreRefs: true,
      allowFunctions: true,
      allowArrowFunctions: true,
    }],
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-uses-react': 'off',
    'react/no-array-index-key': 'error',
    'react/no-danger': 'warn',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    'react/no-unstable-nested-components': 'error',
    'react/no-unused-prop-types': 'error',
    'react/prefer-es6-class': 'error',
    'react/prefer-stateless-function': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'react-hooks/exhaustive-deps': ['error', { additionalHooks: 'useRequest' }],
    'react-hooks/rules-of-hooks': 'error',
    'rest-spread-spacing': 'off',
    semi: 'off',
    'sort-keys': ['error', 'asc', { minKeys: 12, natural: true }],
    strict: ['error', 'never'], // assume type=module output (cli default)
    'unicode-bom': 'error',
    'valid-jsdoc': 'off',
  },
  settings: {
    // Preact CLI provides these defaults
    targets: ['last 2 versions'],
    polyfills: ['fetch', 'Promise'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
};
