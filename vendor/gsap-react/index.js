// Minimal useGSAP stub for offline installation.
exports.useGSAP = function useGSAP(callback) {
  // Execute immediately to mirror simple hook behavior.
  if (typeof callback === 'function') {
    callback();
  }
  return { contextSafe: (fn) => fn };
};
