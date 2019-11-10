import * as array from 'lodash/array'

export const effect = (async_fn) => async (ctx) => {
  await async_fn(ctx)
  return ctx
}

const throwIfContextDoesNotContain = (list) => (context) => {
  const diff = array.difference(list, Object.keys(context))
  if (diff.length > 0)
    throw `Missing context: ${diff.join(', ')}`
}

export const check = (list) =>
  effect(throwIfContextDoesNotContain(list))
