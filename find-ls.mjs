// Intercept localStorage.getItem to print a stack trace showing what calls it
const origGetItem = localStorage.getItem;
const origSetItem = localStorage.setItem;

// Override to capture stacks
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem(...args) {
      const err = new Error('localStorage.getItem called');
      console.error(err.stack);
      if (typeof origGetItem === 'function') return origGetItem.apply(this, args);
      return null;
    },
    setItem(...args) {
      if (typeof origSetItem === 'function') return origSetItem.apply(this, args);
    },
    removeItem() {},
    clear() {},
  },
  writable: true,
  configurable: true,
});

// Now load zustand middleware to see if it triggers
import('./node_modules/zustand/middleware.js').then(() => {
  console.log('zustand middleware loaded - no localStorage.getItem call at load time');
}).catch(e => console.error('load error:', e));
