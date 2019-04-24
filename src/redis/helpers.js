export const transformOne = (t, defaultValue) => (v) =>
  v && t(v) || defaultValue

export const transformValues = (t) => (object) =>
  Object.entries(object)
        .reduce((acc, [k, v]) => ({...acc, [k]: t(v)}), {})

export const coalesce = (defaultOutput) => (input) =>
  input ? input : defaultOutput
