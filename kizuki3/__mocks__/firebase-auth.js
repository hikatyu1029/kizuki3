module.exports = {
  getAuth: jest.fn(() => ({ currentUser: null })),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    callback(null);
    return jest.fn(); // unsubscribe
  }),
  signOut: jest.fn(() => Promise.resolve()),
  GoogleAuthProvider: jest.fn(),
  OAuthProvider: jest.fn(),
  signInWithCredential: jest.fn(),
};
