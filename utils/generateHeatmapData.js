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
  for (let i = 0; i < HEIGHT; i++) {
    result[i] = []
    for (let j = 0; j < WIDTH; j++) {
      result[i][j] = 0
    }
  }

  for (let i=0, l=data.length; i < l; i++) {
    console.log(`Start with data[${i}]`)
    // convert raw coordinates to coordinates of the block unit
    const bottomLeftX = Math.floor(parseFloat(data[i].x1) / UNIT)
    const bottomLeftY = Math.floor(parseFloat(data[i].y1) / UNIT)
    const topRightX = Math.floor(parseFloat(data[i].x2) / UNIT)
    const topRightY = Math.floor(parseFloat(data[i].y2) / UNIT)

    console.log(bottomLeftX, bottomLeftY, topRightX, topRightY)

    // increment values of each block unit that is in the bounding box
    for (let k = bottomLeftY; k <= topRightY; k++) {      // for each row (y)
      for (let j = bottomLeftX; j <= topRightX; j++) {    // loop through each cell (x)
        let x,y
        // if x is out of frame
        if (j < 0)
          x = 0
        else if (j >= WIDTH)
          x = WIDTH-1
        // not out of frame
        else x = j

        // if y is out of frame
        if (k < 0)
          y = 0
        else if (k >= HEIGHT)
          y = HEIGHT-1
        else y = k

        result[y][x]++
      }
    }

  }

  return result
}

module.exports = generateHeatmapData