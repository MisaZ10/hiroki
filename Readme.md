# Hiroki [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

 build REST APIs faster than ever using the open source tools and standards you and your team already know.

hiroki is an open source tool inspired by [baucis](https://github.com/wprl/baucis).

hiroki is fully compatible with mongoose 4 and 5.

hiroki is written in ES6 standards.

read the [documentation here](https://ivanhuay.github.io/hiroki/).
### Getting Started
To install:
```
npm install --save hiroki
```

Create simple rest api:
```javascript
const express = require('express');
const hiroki = require('hiroki');
const app = express();
const UsersSchema = new mongoose.Schema({name: String});
mongoose.model('Users', UsersSchema);

hiroki.rest('Users');//enable GET,PUT,POST & DELETE methods

app.use(hiroki.build());//automatically use the route "/api"
app.listen(8012);
```
### Build config:

it is possible to change the route that hiroki uses
```javascript
const config = {path:'/api/v1'};
app.use(hiroki.build(config));

```
### Changelog
* v0.1.1: Bugfix count with conditions error.
* v0.1.0:
  * PUT request fire pre save hook in Mongoose Schema.
  * PUT udpate by condition only update one document.
  * findOneAndUpdate method removed from PUT request.
* v0.0.9: Add support for new conditions format.
```
ej: GET /api/users?conditions[active]=true
```
* v0.0.8: fix general request function affect all routes.
This type of decorators affected all the routes.
```javascript
...
controller.request((req,res,next) => {
  res.status(401).json({});
})
```
now it only affects the route of that collection

### Sponsors:

[![Alt icon](https://grava.digital/assets/img/brandFooter.svg)
](https://grava.digital)



[npm-image]: https://badge.fury.io/js/hiroki.svg
[npm-url]: https://npmjs.org/package/hiroki
[travis-image]: https://travis-ci.com/ivanhuay/hiroki.svg?branch=master
[travis-url]: https://travis-ci.com/ivanhuay/hiroki
[daviddm-image]: https://david-dm.org/ivanhuay/hiroki.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ivanhuay/hiroki
