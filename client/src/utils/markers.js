/**
 * Marker label style
 */
export const customMarkerLabelStyle = {
  backgroundColor: `rgba(250, 250, 250, .7)`, 
  fontSize: `.875rem`, 
  padding: `.25rem`,
  fontWeight: 700,
  borderRadius: `3px`
}

/**
 * Use these objects to define the thresholds of PM and traffic levels.
 * Maximum number of thresholds is 5.
 */
export const airLevels = {
  num: 4,
  pm2_5: [50, 100, 150, 200],
  pm10: [100, 200, 300, 400]
}

export const visualLevels = {
  num: 5,
  pedestrian: [10, 20, 30, 40, 50],
  bicycle: [10, 20, 30, 40, 50],
  vehicle: [10, 20, 30, 40, 50]
}

/**
 * Get air marker level based on data field
 * @param {string} name name of PM
 * @param {string} data amount of PM particles
 */
export const getAirMarkerLevel = (name, data) => {
  const thresholds = airLevels[name]
  for (let i = 0; i < airLevels.num; i++) {
    if (data < thresholds[i])
      return (i+1)
  }
  return airLevels.num+1
}

/**
 * Get visual marker level based on data field
 * @param {string} name name of traffic type
 * @param {string} data traffic counter
 */
export const getVisualMarkerLevel = (name, data) => {
  const thresholds = visualLevels[name]
  for (let i = 0; i < visualLevels.num; i++) {
    if (data < thresholds[i])
      return (i+1)
  }
  return visualLevels.num+1
}
