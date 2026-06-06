// Manual mock for react-native: bypasses mockComponent.js / React 19 incompatibility
const React = require('react');

function comp(name) {
  const C = React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children),
  );
  C.displayName = name;
  return C;
}

const StyleSheet = {
  create: (s) => s,
  flatten: (s) => (Array.isArray(s) ? Object.assign({}, ...s.filter(Boolean)) : s ?? {}),
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
};

const Platform = { OS: 'ios', select: (obj) => obj.ios ?? obj.default };

const FlatList = ({ data = [], renderItem, keyExtractor, contentContainerStyle }) =>
  React.createElement(
    'FlatList',
    { contentContainerStyle },
    data.map((item, index) =>
      React.createElement(
        React.Fragment,
        { key: keyExtractor ? keyExtractor(item, index) : index },
        renderItem({ item, index }),
      ),
    ),
  );

const Modal = ({ children, visible, onRequestClose }) =>
  visible ? React.createElement('Modal', { onRequestClose }, children) : null;

module.exports = {
  View: comp('View'),
  Text: comp('Text'),
  TextInput: comp('TextInput'),
  Pressable: comp('Pressable'),
  TouchableOpacity: comp('TouchableOpacity'),
  Modal,
  ScrollView: comp('ScrollView'),
  KeyboardAvoidingView: comp('KeyboardAvoidingView'),
  SafeAreaView: comp('SafeAreaView'),
  FlatList,
  StyleSheet,
  Platform,
  Dimensions: {
    get: () => ({ width: 390, height: 844, scale: 2, fontScale: 1 }),
    addEventListener: () => ({ remove: () => {} }),
  },
  Alert: { alert: jest.fn() },
  Animated: {
    Value: class {
      constructor(v) { this._v = v; }
    },
    View: comp('Animated.View'),
    createAnimatedComponent: (C) => C,
    timing: () => ({ start: (cb) => cb?.({ finished: true }) }),
    spring: () => ({ start: (cb) => cb?.({ finished: true }) }),
  },
  useColorScheme: () => 'light',
  useWindowDimensions: () => ({ width: 390, height: 844, scale: 2, fontScale: 1 }),
  NativeModules: {},
  NativeEventEmitter: class {
    addListener() { return { remove() {} }; }
  },
  AppState: {
    currentState: 'active',
    addEventListener: () => ({ remove: () => {} }),
  },
};
