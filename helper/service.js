
const capitalizeKeys = (obj) => {
    const isObject = o => Object.prototype.toString.apply(o) === '[object Object]'
    const isArray = o => Object.prototype.toString.apply(o) === '[object Array]'
    
    let transformedObj = isArray(obj) ? [] : {}
    
    for (let key in obj) {
      // replace the following with any transform function
      const transformedKey = key.replace(/^\w/, (c, _) => c.toUpperCase())
  
      if (isObject(obj[key]) || isArray(obj[key])) {
        transformedObj[transformedKey] = capitalizeKeys(obj[key])
      } else {
        transformedObj[transformedKey] = obj[key]
      }
    }
    return transformedObj
}

module.exports.capitalizeKeys = capitalizeKeys;