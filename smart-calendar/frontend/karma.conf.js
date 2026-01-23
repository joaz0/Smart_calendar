module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // config do jasmine
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/smart-calendar'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],

    // --- A CONFIGURAÇÃO RECOMENDADA PARA SEU AMBIENTE ---
    hostname: '127.0.0.1', // Força localhost (IPv4)
    listenAddress: '127.0.0.1', // Impede que tente 0.0.0.0 (que gera EPERM)
    port: 0, // 0 = "Automático". O Karma acha uma porta livre (ex: 45123) e evita colisão.

    browsers: ['ChromeHeadlessNoSandbox'], // Usa nosso launcher customizado abaixo
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // Obrigatório para rodar como root/container
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--remote-debugging-port=9222'
        ]
      }
    },
    // ----------------------------------------------------

    watch: false,
    restartOnFileChange: true,
    singleRun: true // Roda os testes e fecha (bom para CI)
  });
};
