module.exports = {
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
}