const React = require('react');

const SafeAreaView = ({ children, style }) =>
  React.createElement('SafeAreaView', { style }, children);

module.exports = {
  SafeAreaView,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
};
