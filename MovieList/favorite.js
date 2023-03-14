const base_url = 'https://webdev.alphacamp.io'
const index_url = base_url + '/api/movies/' //後接API 電影id
const poster_url = base_url + '/posters/' //後接API image參數
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const btnShowMovie = document.querySelector('.btn-show-movie')
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector("#search-input")
const removeFavorite = document.querySelector('.btn-remove-favorite')



// remove_監聽器////////////////////////////////////////////////
function removeFavoriteMovie(id){
  // 傳入id在收藏清單中不存在 || 收藏清單是空的
  if (!movies || !movies.length) return 

  const movieIndex = movies.findIndex(function(movie){  //findIndex:若找不到值會回傳 -1
    return movie.id === id
  })
  if(movieIndex === -1) return
  // console.log(movieIndex) //測試
  // console.log(movies) //測試
  movies.splice(movieIndex,1)
  
  localStorage.setItem('favoriteMovies',JSON.stringify(movies)) //JSON stringify將資料轉成JSON格式
  renderMoviesList(movies)
}

// More_鍵監聽器/////////////////////////////////////////////////
dataPanel.addEventListener('click',function onPanelClick(event){
    const target = event.target
    // 在card的more <button>中加上data-id${item.id}
    if(target.matches('.btn-show-movie')){
      // console.log(target.dataset.id)
      showMovieModal(Number(target.dataset.id))      
    }else if(target.matches('.btn-remove-favorite')){
      removeFavoriteMovie(Number(target.dataset.id))
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
// renderMoviesList//////////////////////////////////////////
function renderMoviesList(data){
  let rawHTML = ''
  data.forEach(function(item){
    rawHTML +=`
    
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${poster_url + item.image}" class="card-img-top" alt="Movie Poster"/>
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" data-id='${item.id}'class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
              <button type="button" data-id='${item.id}' class="btn btn-danger btn-remove-favorite">X</button>
            </div> 
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}
renderMoviesList(movies)