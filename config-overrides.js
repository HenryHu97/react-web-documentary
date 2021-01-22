const { override, addLessLoader, addDecoratorsLegacy } = require('customize-cra')

module.exports = override(
  addLessLoader(),
  addDecoratorsLegacy()
)