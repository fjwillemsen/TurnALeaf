import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/jsx-runtime.js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import gitignore from 'eslint-config-flat-gitignore'
import tsdoc from 'eslint-plugin-tsdoc'

export default [
    gitignore(),
    {
        languageOptions: { globals: globals.browser },
        ignores: ['.github/'],
        plugins: {
            tsdoc,
        },
        rules: {
            'tsdoc/syntax': 'error',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        ...pluginReactConfig,
        settings: { react: { version: 'detect' } },
    },
]
