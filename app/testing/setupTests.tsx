import "@testing-library/react";
import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  // Reset any global state or mocks before each test
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
