/** 
 * Function that takes data of bounding boxes to generate data used for
 * heatmap. This function assumes the screen resolution is 1280 x 720.
 * Each square of 4 x 4 pixels will be treated as 1 block unit in the heatmap.
 * 
 * @param {array} data [{x1,y1,x2,y2}]
 */
const generateHeatmapData = (data) => {
  // define unit
  const UNIT = 4
  const WIDTH = 1280 / UNIT
  const HEIGHT = 720 / UNIT

  // initalise result matrix
  let result = []
  for (let i = 0; i < WIDTH; i++) {
    result[i] = []
    for (let j = 0; j < HEIGHT; j++) {
      result[i][j] = 0
    }
  }

  for (let i=0, l=data.length; i < l; i++) {

    // convert raw coordinates to coordinates of the block unit
    const x1 = Math.floor(parseFloat(data[i].x1) / UNIT)
    const y1 = Math.floor(parseFloat(data[i].y1) / UNIT)
    const x2 = Math.floor(parseFloat(data[i].x2) / UNIT)
    const y2 = Math.floor(parseFloat(data[i].y2) / UNIT)

    // find the coordinates of top left and bottom right corners of bounding box
    const topLeftX = (x1 < x2 ? x1 : x2)
    const topLeftY = (y1 > y2 ? y1 : y2)
    const bottomRightX = (x1 > x2 ? x1 : x2)
    const bottomRightY = (y1 < y2 ? y1 : y2)

    // increment values of each block unit that is in the bounding box
    for (let j = topLeftX; j <= bottomRightX; j++) {
      for (let k = topLeftY; k >= bottomRightY; k--) {
        if (j >= 0 && k >= 0 && j < WIDTH && k < HEIGHT)
          result[j][k]++
      }
    }

  }

  return result
}

module.exports = generateHeatmapData