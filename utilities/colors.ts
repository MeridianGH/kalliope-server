import { Canvas, loadImage } from 'skia-canvas'

export function rgbToHEX(color: Uint8ClampedArray) {
  return '#' + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1)
}

export function hexToRGB(color: string) {
  const rgb = parseInt(color.substring(1), 16)
  const r = rgb >> 16
  const g = rgb - (r << 16) >> 8
  const b = rgb - (r << 16) - (g << 8)
  return new Uint8ClampedArray([r, g, b])
}

export function preventSimilarColor(color: string, reference: string, brighten = false) {
  function changeColor(color: string, reference: string, brighten: boolean, recursionDepth = 0, originalColor = color) {
    const stepSize = 20
    const maxDepth = Math.ceil(255 / stepSize)
    if (recursionDepth + 1 >= maxDepth) { return changeColor(originalColor, reference, !brighten) }

    const clrRGB = hexToRGB(color)
    const refRGB = hexToRGB(reference)
    const difference = Math.abs(clrRGB[0] - refRGB[0]) + Math.abs(clrRGB[1] - refRGB[1]) + Math.abs(clrRGB[2] - refRGB[2])
    if (difference > 75) { return color }

    const changed = rgbToHEX(clrRGB.map((value) => brighten ? value + stepSize : value - stepSize))
    if (changed === color) { return changeColor(originalColor, reference, !brighten) }
    return changeColor(changed, reference, brighten, recursionDepth + 1, originalColor)
  }
  try {
    return changeColor(color, reference, brighten)
  } catch (e) {
    return color
  }
}

export async function findDominantColor(url: string) {
  const img = await loadImage(url)
  const canvasSize = 20
  const canvas = new Canvas(canvasSize, canvasSize)
  const ctx = canvas.getContext('2d')

  const colors: Record<string, number> = {}
  ctx.filter = 'blur(2px)'
  ctx.drawImage(img, 0, 0, canvasSize, canvasSize)
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize).data
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = rgbToHEX(new Uint8ClampedArray([
      imageData[i] - imageData[i] % 32,
      imageData[i + 1] - imageData[i + 1] % 32,
      imageData[i + 2] - imageData[i + 2] % 32
    ]))
    colors[rgb] = (colors[rgb] ?? 0) + 1
  }
  return Object.keys(colors).reduce((a, b) => colors[a] > colors[b] ? a : b)
}
