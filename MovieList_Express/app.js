const express = require('express')
const app = express()
const port = 3000
// 載入express-handlebars
const exphbs = require('express-handlebars')
const movieList = require('./movies.json') //用./會從根目錄開始尋找，若沒用./ 則從node_module尋找
// 對 Node.js 來說，如果沒有提供檔案路徑， Node.js 讀取它時就會預設是模組。如果有包括路徑，那 Node.js 就知道這是個檔案。


// setting template engine
// 佈局&局部樣版
app.engine('handlebars', exphbs({defaultLayout :'main'})) //參數一:樣版引擎名稱。參數二:樣板引擎相關設定，這裡設定了預設的佈局（default layout）需使用名為 main 的檔案。
app.set('view engine', 'handlebars') //透過這個方法告訴 Express 說要設定的 view engine 是 handlebars。

app.use(express.static('public')) //使用靜態路由


app.get('/', (req, res) => {
  res.render('index', {movies: movieList.results}) //render為Express模組語法
})


// show.handlebar(方法一 : 自想)
// app.get('/movies/:movie_id', (req, res) =>{
//   res.render('show', { movie : movieList.results[Number(req.params.movie_id)-1]})
// })
// show.handlebars(方法二 : filter)
app.get('/movies/:movie_id',(req, res) => {
  // console.log(req.params.movie_id) //測試params
  const movie = movieList.results.filter(function(movie){
    return movie.id.toString() === req.params.movie_id
  })
  // console.log(movie) //觀察filter回傳的movie -->會是[{}]
  res.render('show', {movies : movie[0]})
})
// show.handlebars(方法三 : find)
// app.get('/movies/:movie_id', (req, res) =>{
//   const movie = movieList.results.find((movie) => movie.id.toString() === req.params.movie_id)
//   // console.log(movie) // 觀察find回傳的movie -->會是{}
//   res.render('show', {movies: movie})
// })

// 搜尋路由 index.handlebars
// query用法
app.get('/search', (req,res) => {
  const keyword = req.query.keyword
  // console.log(req.query.keyword)
  const searchMovies = movieList.results.filter((movie) => {  
    // 用find只找的到一筆資料，回傳一個{}，用filter回傳[{},{},{}]
    return movie.title.toLowerCase().includes(keyword.toLowerCase())
  })
  console.log(searchMovies)
  res.render('index', { movies : searchMovies , keyword : keyword})
})




app.listen(port, () => {
 console.log(`express is running on http://localhost:${port}`) 
})

// (req.params.id)-1