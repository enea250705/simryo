// Global polyfill to fix 'self is not defined' error
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
}

if (typeof globalThis !== 'undefined' && typeof self === 'undefined') {
  globalThis.self = globalThis;
}