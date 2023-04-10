const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
app.engine('handlebars', exphbs({defaultLayout : 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

const restaurantList = require('./restaurant.json')


app.get('/', (req, res) => {
  const restaurant = restaurantList.results
  // console.log(restaurant)
  res.render('index',{restaurant : restaurant})
  //也可以-->res.render('index',{restaurant : restaurant}).results
})

// show-handlebars
app.get('/restaurants/:restaurant_id', (req, res) => {
  // console.log(req.params.restaurant_id) //檢查params的值
  const restaurant = restaurantList.results.find( (item) => {
    return item.id === Number(req.params.restaurant_id)
  })
  // console.log(restaurant) //檢查抓出來的東西是否正確
  res.render('show', { restaurant : restaurant})
})

// search-handlebars
app.get('/search', (req, res) => {
  // console.log(req.query)
  if (!req.query.keyword) {
    return res.redirect("/") //注意redirect用法
  }
  const keyword = req.query.keyword
  const restaurant = restaurantList.results.filter( (item) => {
    return item.name.toLowerCase().trim().includes(keyword.toLowerCase()) || item.category.toLowerCase().trim().includes(keyword.toLowerCase())
  })
  // console.log(restaurant)
  res.render('index',{restaurant : restaurant, keyword : keyword})
})



app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})