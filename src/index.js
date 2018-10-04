const request = require('superagent');
const Promise = require('bluebird');
const base64 = require('base-64');
 
class Spectre {
  constructor(url) {
    this.url = url;
    this.screenshots = [];
  }

  setProxyConnection({type, username, password}){
    const credentials = base64.encode(`${username}:${password}`);
    this.authorization = `${type} ${credentials}`;
  }

  startRun(project, suite) {
    return new Promise((resolve, reject) => {
      let reqBuilder = 
      request
        .post(this.url + '/runs')
        .send({ project, suite });
      if(this.authorization)
        reqBuilder.set('Authorization', this.authorization);
        reqBuilder.end((err, res) => {
          err ? reject(err) : resolve(res.body.id);
        });
    });
  }

  uploadScreenshot(run_id, name, browser, width, screenshot) {
    return new Promise((resolve, reject) => {
      let reqBuilder =
      request
        .post(this.url + '/tests')
        .field('test[run_id]', run_id)
        .field('test[name]', name)
        .field('test[browser]', browser)
        .field('test[size]', width)
        .field('test[highlight_colour]', "ff0000")
        .attach('test[screenshot]', screenshot)
        if(this.authorization)
          reqBuilder.set('Authorization', this.authorization);
        reqBuilder.end((err, res) => {
          err ? reject(err) : resolve(res);
        });
    });
  }

  uploadScreenshots() {
    let uploads = [];

    this.screenshots.forEach((screenshot) => {
      uploads.push(screenshot());
    });

    return Promise.all(uploads);
  }

  queueScreenshot(run_id, name, browser, width, screenshot) {
    this.screenshots.push(this.uploadScreenshot.bind(this, ...arguments));
  }
}

module.exports = Spectre;
