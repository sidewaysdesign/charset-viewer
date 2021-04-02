function isBlankChar(chr) {
  var mycanvas = document.createElement('canvas')
  mycanvas.width = 8
  mycanvas.height = 8
  document.body.appendChild(mycanvas)
  var ctx = mycanvas.getContext('2d')
  ctx.font = "4px monospace, 'segoe ui symbol', 'segoe ui symbol', source-code-pro"
  ctx.fillText(chr, 0, 6)
  let imgData = ctx.getImageData(0, 0, 8, 8)
  let isBlank = true
  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i + 3]) {
      isBlank = false
      break
    }
  }
  document.body.removeChild(mycanvas)
  return isBlank
}
export { isBlankChar }
