import * as array from 'lodash/array'

export const effect = (asyncFN) => async (ctx) => {
  await asyncFN(ctx)
  return ctx
}

export const chain = (asyncFN) => async (ctx) => {
  const newctx = await asyncFN(ctx)
  return { ...ctx, ...newctx }
}

export const chachain = (fn) => (...args) =>
  chain(fn(...args))

const throwIfContextDoesNotContain = (list) => (context) => {
  const diff = array.difference(list, Object.keys(context))
  if (diff.length > 0)
    throw `Missing context: ${diff.join(', ')}`
}

export const check = (list) =>
  effect(throwIfContextDoesNotContain(list))

export const contextMustContain = check

export const Railway = (operations) => (ctx) =>
  operations.reduce((acc, op) => acc.then(op), Promise.resolve(ctx))