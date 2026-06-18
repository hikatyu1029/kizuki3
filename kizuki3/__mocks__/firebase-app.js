const apps = [];

module.exports = {
  initializeApp: jest.fn((config) => {
    const app = { name: '[DEFAULT]', options: config };
    if (!apps.length) apps.push(app);
    return app;
  }),
  getApps: jest.fn(() => [...apps]),
  getApp: jest.fn(() => apps[0] ?? null),
};
