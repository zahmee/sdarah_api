'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _key = require('../controller/key');

var _key2 = _interopRequireDefault(_key);

var _keys = require('../controller/keys');

var _keys2 = _interopRequireDefault(_keys);

var _account = require('../controller/account');

var _account2 = _interopRequireDefault(_account);

var _users = require('../controller/users');

var _users2 = _interopRequireDefault(_users);

var _settings = require('../controller/settings');

var _settings2 = _interopRequireDefault(_settings);

var _items = require('../controller/items');

var _items2 = _interopRequireDefault(_items);

var _people = require('../controller/people');

var _people2 = _interopRequireDefault(_people);

var _csBills = require('../controller/csBills');

var _csBills2 = _interopRequireDefault(_csBills);

var _itemsDetails = require('../controller/itemsDetails');

var _itemsDetails2 = _interopRequireDefault(_itemsDetails);

var _invoice = require('../controller/invoice');

var _invoice2 = _interopRequireDefault(_invoice);

var _branches = require('../controller/branches');

var _branches2 = _interopRequireDefault(_branches);

var _exchangeCustody = require('../controller/exchangeCustody');

var _exchangeCustody2 = _interopRequireDefault(_exchangeCustody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

(0, _db2.default)(function (db) {
  //middleware
  router.use((0, _middleware2.default)({ config: _config2.default, db: db }));
  //api routes v1 (/v1)
  router.use("/key", (0, _key2.default)({ config: _config2.default, db: db }));
  router.use("/keys", (0, _keys2.default)({ config: _config2.default, db: db }));
  router.use("/account", (0, _account2.default)({ config: _config2.default, db: db }));
  router.use("/users", (0, _users2.default)({ config: _config2.default, db: db }));
  router.use("/settings", (0, _settings2.default)({ config: _config2.default, db: db }));
  router.use("/items", (0, _items2.default)({ config: _config2.default, db: db }));
  router.use("/peoples", (0, _people2.default)({ config: _config2.default, db: db }));
  router.use("/csbills", (0, _csBills2.default)({ config: _config2.default, db: db }));
  router.use("/itemsDetails", (0, _itemsDetails2.default)({ config: _config2.default, db: db }));
  router.use("/invoice", (0, _invoice2.default)({ config: _config2.default, db: db }));
  router.use("/branches", (0, _branches2.default)({ config: _config2.default, db: db }));
  router.use("/exchangeCustody", (0, _exchangeCustody2.default)({ config: _config2.default, db: db }));
});
exports.default = router;
//# sourceMappingURL=index.js.map