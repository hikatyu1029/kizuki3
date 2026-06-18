const mockUnsub = jest.fn();

module.exports = {
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn((_db, ...path) => ({ path: path.join('/') })),
  doc: jest.fn((_db, ...path) => ({ path: path.join('/') })),
  query: jest.fn((...args) => args[0]),
  orderBy: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  updateDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => false, data: () => null, id: 'mock-id' }),
  ),
  onSnapshot: jest.fn((_q, callback) => {
    callback({ docs: [] });
    return mockUnsub;
  }),
  serverTimestamp: jest.fn(() => ({ seconds: 0, nanoseconds: 0 })),
};
