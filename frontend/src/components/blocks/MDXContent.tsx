'use client'

import * as runtime from 'react/jsx-runtime'
import { useMemo } from 'react'

interface Props {
  code: string
  components?: Record<string, React.ComponentType<unknown>>
}

export function MDXContent({ code, components = {} }: Props) {
  const Component = useMemo(() => {
    // Velite stores MDX body as compiled JS source. Eval it with jsx-runtime as args[0].
    const fn = new Function(code)
    return fn({ ...runtime, ...components }).default as React.ComponentType<{
      components?: Record<string, React.ComponentType<unknown>>
    }>
  }, [code, components])

  return <Component components={components} />
}
