function OversizeCharCompensator(str) {
  const font = "100px 'Inter Bold', 'apple color emoji', 'segoe ui emoji', 'noto color emoji', notocoloremoji, 'segoe ui symbol', 'android emoji', emojisymbols, 'emojione mozilla', 'twemoji mozilla', 'segoe ui symbol', source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const width = context.measureText(str).width
  const oversizeRatio = Math.min(100 / Math.ceil(width), 1)
  return oversizeRatio
}
export { OversizeCharCompensator }
