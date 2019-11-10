import * as array from 'lodash/array'

export const effect = (async_fn) => async (ctx) => {
  await async_fn(ctx)
  return ctx
}

export const check = (list) => (context) => {
  const diff = array.difference(list, Object.keys(context))
  if (diff.length > 0)
    throw `Missing context: ${diff.join(', ')}`
  return context
}
