// Main Domain Exports
module.exports = {
  domains: {
    auth: require('./domains/auth'),
    catalog: require('./domains/catalog'),
    inventory: require('./domains/inventory'),
    finance: require('./domains/finance'),
    fleet: require('./domains/fleet'),
    projects: require('./domains/projects'),
    calendar: require('./domains/calendar')
  },
  shared: require('./shared')
};