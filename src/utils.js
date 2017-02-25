import Immutable from 'immutable'

export const squared = x => Math.pow(x, 2)

export const sqrt = x => Math.sqrt(x)

export const distance = (p1, p2) => sqrt(squared(p1.x - p2.x) + squared(p1.y - p2.y))

export const minus = (p1, p2) => ({x: p1.x - p2.x, y: p1.y - p2.y})

export const add = (p1, p2) => ({x: p1.x + p2.x, y: p1.y + p2.y})

export const divide = (p1, v) => ({x: p1.x / v, y: p1.y / v})

export const multiply = (p1, v) => ({x: p1.x * v, y: p1.y * v})

export const origin = {x: 0, y: 0}

export const normalize = (p1) => divide(p1, distance(p1, origin))

export const time = fn => (...args) => ({...fn(...args), timestamp: Date.now()})

export const pipe = (fns, state) =>
  state.withMutations(st =>
    fns.reduce((s, fn) => fn(s), st)
  )
