export const effect = (async_fn) => async (ctx) => {
  await async_fn(ctx)
  return ctx
}
