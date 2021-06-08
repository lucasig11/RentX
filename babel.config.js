module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
    ],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    "@shared": ["./src/shared"],
                    "@modules": ["./src/modules"],
                    "@routes": ["./src/routes"],
                    "@config": ["./src/config"],
                    "@docs": ["./src/docs"]
                }
            }
        ],
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }]
        ['@babel/plugin-proposal-class-properties', { loose: true }]
    ]
}
