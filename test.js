const df = require('node-df')

df((err, response) => {
  if (err) throw err
  console.log(JSON.stringify(response, null, 2))
})
