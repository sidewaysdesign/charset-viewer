// function isBlankChar(chr) {
//   var mycanvas = document.createElement('canvas')
//   mycanvas.width = 8
//   mycanvas.height = 8
//   document.body.appendChild(mycanvas)
//   var ctx = mycanvas.getContext('2d')
//   ctx.font = "4px monospace, 'segoe ui symbol', 'segoe ui symbol', source-code-pro"
//   ctx.fillText(chr, 0, 6)
//   let imgData = ctx.getImageData(0, 0, 8, 8)
//   let isBlank = true
//   for (let i = 0; i < imgData.data.length; i += 4) {
//     if (imgData.data[i + 3]) {
//       isBlank = false
//       break
//     }
//   }
//   document.body.removeChild(mycanvas)
//   return isBlank
// }
// export { isBlankChar }

const isBlankChar = (function (chr) {
  // console.log('0');
  // var chr = 'x';
  const fontsize = 16
  const testCanvas = document.createElement('canvas')
  document.body.appendChild(testCanvas)
  testCanvas.width = fontsize
  testCanvas.height = fontsize
  const ctx = testCanvas.getContext('2d')

  function isAvailableGlyph(chr) {
    ctx.clearRect(0, 0, fontsize, fontsize)
    ctx.font = `${fontsize * 0.75}px monospace, 'segoe ui symbol', 'segoe ui symbol', source-code-pro`
    ctx.fillText(chr, 0, fontsize * 0.75)
    let imgData = ctx.getImageData(0, 0, fontsize, fontsize)
    let isBlank = true
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3]) {
        isBlank = false
        break
      }
    }
    // document.body.removeChild(mycanvas);
    return isBlank
  }
  return isAvailableGlyph
})()

export { isBlankChar }

// console.clear();

// const chars = ['a', '.', '🢰', ' ']
// // console.log(characterTest(chars[0]));
// // console.log(characterTest(chars[3]));

// // console.log('running')
// const loops = 150
// let totaltime = 0
// for (i = 0; i < loops; i++) {
//   var t0 = performance.now()

//   characterTest(chars[2])
//   var t1 = performance.now()
//   totaltime += t1 - t0
// }

// console.log(`time: ${totaltime / loops} milliseconds`)
