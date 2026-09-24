jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  const mock = {
    getItem: jest.fn(async key => (key in store ? store[key] : null)),
    setItem: jest.fn(async (key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(async key => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
  return { __esModule: true, default: mock, ...mock };
});
