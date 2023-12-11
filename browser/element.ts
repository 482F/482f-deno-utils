/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import type React from 'react'

type Rule = {
  [key in string]:
    | React.CSSProperties
    | Record<`--${string}`, string | number>
    | Rule
}

const kebabCase = (() => {
  const regex = new RegExp(/[A-Z]/g)
  return (str: string) => str.replace(regex, (v) => `-${v.toLowerCase()}`)
})()

function parseRule(rule: Record<string, unknown>): string {
  return Object.entries(rule).map(([key, value]) => {
    if (['string', 'number'].includes(typeof value)) {
      return `${kebabCase(key)}: ${value};`
    } else {
      return `${key} {\n${parseRule(value as Record<string, unknown>)}\n}`
    }
  }).join('\n')
}
export function insertStyle(rule: Rule) {
  const s = document.createElement('style')
  document.head.appendChild(s)

  const rawRule = parseRule(rule)
  s.sheet?.insertRule(rawRule)
}
