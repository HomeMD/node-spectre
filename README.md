# node-spectre

*This library is experimental and the API is likely to change.*

Node Library for [Spectre, a Visual Regression Testing tool](https://github.com/wearefriday/spectre).

## Installation

```
npm install --save node-spectre
```

## Usage

```js
const Spectre = require('node-spectre');

spectre = new Spectre('https://path.to.spectre.server');

spectre
      .startRun('Project Name', 'Suite Name')
      .then(function (id) {
        spectre.uploadScreenshot(run_id, 'Test Name', 'Firefox', 'desktop', './screenshot.png');
      })
```

Connecting to a proxy with basic HTTP Authorization:

```js
  spectre.setProxyConnection({
      type: 'Basic',  // this is the most common, but other HTTP Authentication types can be used
      username: 'authUser',
      password: 'authPass'
  });
```

[WebdriverIO](https://webdriver.io) example:

```js
const Spectre = require('node-spectre');

describe('Login Page', () => {
  let run_id, spectre;

  before(function (done) {
    spectre = new Spectre('https://path.to.spectre.server');

    return spectre
      .startRun('Test your login', this.test.parent.fullTitle())
      .then(function (id) {
        run_id = id;
      })
  })

  afterEach(function () {
    return spectre.uploadScreenshots()
  });

  it('should let you log in', function () {
    browser.url('/');

    let ss = browser.saveScreenshot();

    spectre.queueScreenshot(run_id, 'login page', browser.desiredCapabilities.browserName, 'desktop', ss);

    browser.setValue('[name="login"]', 'username');

    ss = browser.saveScreenshot();

    spectre.queueScreenshot(run_id, 'login page', browser.desiredCapabilities.browserName, 'desktop', ss);
  })
})
```
