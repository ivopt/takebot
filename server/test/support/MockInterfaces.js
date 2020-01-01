export const mockInterfaceImpl = (iface) =>
  Object.getOwnPropertyNames(new iface())
        .reduce((acc, method) => Object.assign(acc, {[method]: jest.fn()}), {})

export const memoizeFn = (fn) => {
  let memo
  return () => memo || (memo = fn())
}

export const memoizedMockImpl = (iface) =>
  memoizeFn(() => mockInterfaceImpl(iface))