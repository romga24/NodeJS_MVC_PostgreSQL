import antfu from '@antfu/eslint-config'

export default antfu({
    formatters: {
        css: true,
        html: true,
        markdown: 'prettier',
    },
    react: {
        overrides: {
            'react-hooks/exhaustive-deps': 'off',
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    stylistic: {
        indent: 'tab',
        jsx: true,
        commaDangle: 'never',
    },
    jsonc: false,
    ignores: ['**/*.json', '**/*.d.ts', '**/*.md', '**/*.config.ts', '**/*.config.js', '**/*.config.cjs', 'vite-env.d.ts', 'vite.cnfig.ts', 'tailwind.config.js', '.prettierrc.cjs'],
    isInEditor: false,
    rules: {
        'antfu/top-level-function': 'off',
        'style/jsx-quotes': ['error', 'prefer-single'],
        'style/jsx-indent-props': 'off',
        'react-refresh/only-export-components': 'off',
        'react/no-foward-ref': 'off',
    },
}, {
    rules: {
        'style/comma-dangle': 'off',
        'style/no-tabs': 'off',
    },
}, {
    files: ['**/*.tsx'],
    rules: {
        'uncicorn/prefer-node-protocol': 'off',
    },
})

