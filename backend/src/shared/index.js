// Shared Components Exports
module.exports = {
  middleware: {
    adminMiddleware: require('./middleware/adminMiddleware'),
    authMiddleware: require('./middleware/authMiddleware'),
    errorHandler: require('./middleware/errorHandler'),
    inputSanitization: require('./middleware/inputSanitization'),
    logger: require('./middleware/logger'),
    security: require('./middleware/security'),
    securityLogger: require('./middleware/securityLogger'),
    upload: require('./middleware/upload')
  },
  utils: {
    ApiError: require('./utils/ApiError'),
    createError: require('./utils/createError'),
    logger: require('./utils/logger'),
    sanitizeHtml: require('./utils/sanitizeHtml')
  },
  models: {
    Counter: require('./models/Counter'),
    SheetEntry: require('./models/SheetEntry')
  },
  services: {
    sheetService: require('./sheetService'),
    sheetSyncService: require('./sheetSyncService'),
    simpleSheetsSync: require('./simpleSheetsSync'),
    googleDriveSync: require('./googleDriveSync'),
    mailService: require('./mailService')
  },
  controllers: {
    sheetController: require('./sheetController'),
    sheetSyncController: require('./sheetSyncController'),
    syncController: require('./syncController'),
    uploadController: require('./uploadController')
  }
};