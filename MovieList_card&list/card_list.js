const base_url = 'https://webdev.alphacamp.io'
const index_url = base_url + '/api/movies/' //後接API 電影id
const poster_url = base_url + '/posters/' //後接API image參數


const btnShowMovie = document.querySelector('.btn-show-movie')
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector("#change-mode")

let filteredMovies = []
const movies = []
const MOVIE_PER_PAGE = 12
let currentPage = 1 //新增變數

axios.get(index_url)
  .then(function(response){
    // console.log(response.data.results) 
    //results的資料為array包object，若要取這類型資料可用(1)for of(2)...
    // for(const x of response.data.results){
    //   console.log(x)
    // }
    movies.push(...response.data.results) //因為movies已用const宣告，無法隨意用 = 賦值，可用push
    // console.log(movies)
    // console.log(movies.length)
    renderPaginator(movies.length)
    renderMoviesList(getMovieByPage(currentPage))
    // console.log(index_url+1) //測試index_url + id
  }).catch(function(error){
    console.log(error)
  })

//切換模式function/////////////////////////////////////////
function  changeDisplayMode(displayMode){
  if (dataPanel.dataset.mode === displayMode){
    return
  }
  dataPanel.dataset.mode === displayMode
}


// 切換模式_監聽/////////////////////////////////////////////
changeMode.addEventListener('click',function onChangeModeClick(event){
  if(event.target.matches('#card-mode-button')){
    dataPanel.dataset.mode = 'card-mode'
    changeDisplayMode('card-mode')
    renderMoviesList(getMovieByPage(currentPage))
  }else if(event.target.matches('#list-mode-button')){
    dataPanel.dataset.mode = 'list-mode'
    changeDisplayMode('list-mode')
    renderMoviesList(getMovieByPage(currentPage))
  }
})


//電影頁面渲染function//////////////////////////////////////////
function renderMoviesList(data){
  if(dataPanel.dataset.mode === 'card-mode'){
    let rawHTML = ''
    data.forEach(function(item){
    rawHTML +=`<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${poster_url + item.image}" class="card-img-top" alt="Movie Poster"/>
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" data-id='${item.id}'class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
            <button type="button" data-id='${item.id}' class="btn btn-info btn-add-favorite">+</button>
          </div> 
        </div>
      </div>
    </div>`
    })
    dataPanel.innerHTML = rawHTML
  }else if(dataPanel.dataset.mode === 'list-mode'){
    let rawHTML = `<ul class="list-group list-group-flush">`
    data.forEach(function(item){
      rawHTML += `<li class="list-group-item mb-2">${item.title}
        <div class="list-button">
          <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id='${item.id}'>More</button>
          <button type="button" class="btn btn-info btn-add-favorite" data-id='${item.id}'>+</button>
        </div></li>`
    })
    rawHTML += `</ul>`
    dataPanel.innerHTML = rawHTML
  }
}





// paginator_監聽器/////////////////////////////////////////
paginator.addEventListener('click',function onPaginatorClick(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  currentPage = page
  renderMoviesList(getMovieByPage(currentPage))   

})

//分頁器渲染function/////////////////////////////////////////
function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''
  for(let page = 1; page <= numberOfPage; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
 

//分頁器function(每頁顯示12部電影)////////////////////////////////
function getMovieByPage(page){
  //第一頁:0~11
  //第二頁:12~23
  //第三頁:24~35
  const data = filteredMovies.length ? filteredMovies:movies
  const startIndex = (page - 1) * MOVIE_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}


//Search_監聽器 ////////////////////////////////////////////////
searchForm.addEventListener('submit',function onSearchFormSubmitted(event){   //監聽器function掛名，到時網頁console回報時才找的到
  event.preventDefault() //取消預設事件
  // console.log('click!')
  const keyword = searchInput.value.toLowerCase().trim()  //可直接用 ".value" 抓到input值 //toLowerCase():轉換為小寫
  // console.log(keyword)
  
// (方法一)for of迴圈
//   for(const movie of movies){
//     if (movie.title.toLowerCase().trim().includes(keyword)){  //!!新用法includes，會區分大小寫 
//       filteredMovies.push(movie)
//     }
//   }

//   if(filteredMovies.length === 0){
//     return alert('cannot find :' + keyword)
//   }else if(keyword.length === 0){
//     return alert("Please enter a valid string")
//   }
//   return renderMoviesList(filteredMovies)
// })

//(方法二) filter--用於陣列
//陣列三寶:map、filter、reduce
  
  // filteredMovies = movies.filter(function(movie) {
  //   return movie.title.toLowerCase().includes(keyword)  //需有return，否則讀取不到
  // })
  // 與上方相同，改用=>(不需加return)
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if(filteredMovies.length === 0){
    return alert(`您輸入的關鍵字:" ${keyword} "沒有符合條件的電影`)
  }
  currentPage = 1
  renderPaginator(filteredMovies.length)
  renderMoviesList(getMovieByPage(currentPage))
})


//收藏function///////////////////////////////////////////////
function addFavoriteMovies(id){

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []  //JSON.parse() 將JSON格式轉乘JavaScript物件
  const movie = movies.find(function(movie){
    return movie.id === id
  })
  // console.log(movie)
  if(list.some(function(movie){
      return movie.id === id
    })){
      return alert('此電影已在收藏清單中')
  }
//上面改寫
  // if(list.some((movie)=>movie.id === id)){
  //     return alert('此電影已在收藏清單中')
  // }
 
  list.push(movie)
  // console.log(list) 測試
  localStorage.setItem('favoriteMovies',JSON.stringify(list)) //JSON stringify將資料轉成JSON格式
}


// More鍵_監聽器/////////////////////////////////////////////////
dataPanel.addEventListener('click',function onPanelClick(event){
    const target = event.target
    // 在card的more <button>中加上data-id${item.id}
    if(target.matches('.btn-show-movie')){
      // console.log(target.dataset.id)
      showMovieModal(Number(target.dataset.id))      
    }else if(target.matches('.btn-add-favorite')){
      addFavoriteMovies(Number(target.dataset.id))
    }
  })

// modal function/////////////////////////////////////////////////
function showMovieModal(id){
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const movieModalImage = document.querySelector('#movie-modal-image')
  const movieModalDate = document.querySelector('#movie-modal-date')
  const movieModalDescription = document.querySelector('#movie-modal-description')
  axios.get(index_url + id).then(response=>{
    const data = response.data.results
    movieModalTitle.innerText = data.title
    movieModalImage.innerHTML = `<img src="${poster_url}${data.image}" alt="movie-poster" class="img-fluid">`
    movieModalDate.innerText = 'Release date:'+ data.release_date
    movieModalDescription.innerText = data.description
  }).catch((error) => console.log(error))

}


