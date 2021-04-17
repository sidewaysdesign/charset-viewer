const isBlank = (function (chr) {
  const fontsize = 16
  const isBlankCanvas = document.createElement('canvas')
  document.body.appendChild(isBlankCanvas)
  isBlankCanvas.width = fontsize
  isBlankCanvas.height = fontsize
  const ctx = isBlankCanvas.getContext('2d')
  isBlankCanvas.style.visibility = 'hidden'
  ctx.font = `${fontsize * 0.75}px monospace, 'segoe ui symbol', 'segoe ui symbol', source-code-pro`
  function isAvailableGlyph(chr) {
    ctx.clearRect(0, 0, fontsize, fontsize)
    ctx.fillText(chr, 0, fontsize * 0.75)
    let imgData = ctx.getImageData(0, 0, fontsize, fontsize)
    let isBlank = true
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3]) {
        isBlank = false
        break
      }
    }
    return isBlank
  }
  return isAvailableGlyph
})()

const checkUnavailable = (function (chr) {
  var fontsize = 16
  var testCanvas = document.createElement('canvas')
  document.body.appendChild(testCanvas)
  testCanvas.width = fontsize
  testCanvas.height = fontsize
  testCanvas.style.visibility = 'hidden'
  testCanvas.style.display = 'none'
  const ctx = testCanvas.getContext('2d')
  ctx.font = `${fontsize * 0.75}px Inter, 'apple color emoji', 'segoe ui emoji', 'noto color emoji', notocoloremoji, 'segoe ui symbol', 'android emoji', emojisymbols, 'emojione mozilla', 'segoe ui symbol', source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;`
  ctx.fillText('⸾', 0, fontsize * 0.75)
  const privateUseChar = ctx.getImageData(0, 0, fontsize, fontsize)
  function glyphStatusFunc(chr) {
    ctx.clearRect(0, 0, fontsize, fontsize)
    ctx.fillText(chr, 0, fontsize * 0.75)
    var imgData = ctx.getImageData(0, 0, fontsize, fontsize)
    var isBlank = true
    var isUnavailable = true
    var len = imgData.data.length
    for (var i = 0; i < len; i += 4) {
      if (imgData.data[i + 3] !== privateUseChar.data[i + 3]) {
        isUnavailable = false
        break
      }
      if (!isBlank && !isUnavailable) break
    }
    return isUnavailable
  }
  return glyphStatusFunc
})()

const decodeEntities = (function () {
  const element = document.createElement('div')
  function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
      element.innerHTML = str
      str = element.textContent
    }
    return str
  }
  return decodeHTMLEntities
})()

export { isBlank, checkUnavailable, decodeEntities }
