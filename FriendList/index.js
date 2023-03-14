const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/" //後接USER id
const userPanel = document.querySelector('#user-container')
const userList = []
let filterUser = [] //若用const ，會有問題跑不出來
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const searchButton = document.querySelector('#search-button')
const cardFooter = document.querySelector('.card-footer')
const USER_PER_PAGE = 14
const paginator = document.querySelector('#paginator')

axios.get(INDEX_URL).then(response =>{
  userList.push(...response.data.results)
  // console.log(userList)
  renderPaginator(userList.length)
  renderUserCard(getUserByPage(1))
}).catch(error => {
  console.log(error)
})


// 分頁監聽//////////////////////////////////////////
paginator.addEventListener("click",function onPaginatorClick(event){
  if(event.target.tagName !== 'A'){
    return
  }
  const page = Number(event.target.dataset.page)
  renderUserCard(getUserByPage(page))
})

//分頁渲染///////////////////////////////////////////////
function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''
  for(let page = 1; page <= numberOfPage; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML

}



// 分頁////////////////////////////////////////////////
function getUserByPage(page){
  const startIndex = (page - 1) * USER_PER_PAGE
  const data = filterUser.length? filterUser : userList
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}


// 收藏清單_function///////////////////////////////////
function addToFavorite(id){
  const favoriteList = JSON.parse(localStorage.getItem('favoriteList')) || []
  const favoriteUser = userList.find((user => user.id === id))
  if(favoriteList.some((user) => user.id === id )){
    return alert ("已加入最愛清單")
  }
  favoriteList.push(favoriteUser)
  console.log(favoriteList)
  localStorage.setItem('favoriteList',JSON.stringify(favoriteList))

}


// 收藏_監聽器////////////////////////////////////////
// cardFooter.addEventListener('click',function onFavoriteButtonClick(event){

//   if(event.target.matches('#favorite-button, .fa-heart')){
//     addToFavorite(Number(event.target.dataset.id))
//     // console.log(Number(event.target.dataset.id))
//   }
// })


//Search_監聽器/////////////////////////////////////////////
searchForm.addEventListener('submit',function onSearchSubmit(event){
  event.preventDefault()
  const keyword = searchInput.value.toLowerCase().trim()
  // console.log(keyword) //測試
  filterUser = userList.filter((user) =>
    user.name.toLowerCase().includes(keyword)

  )
  if (filterUser.length === 0){
    return alert(`查無 ${keyword} 搜尋結果`)
  }
  renderPaginator(filterUser.length)
  renderUserCard(getUserByPage(1))
})



// 點擊_監聽器//////////////////////////////////////////////////

userPanel.addEventListener('click',function onPanelClick(event){
  console.log(event.target)
  if (event.target.matches('.card-img-top, .card-title')){
    userModal(event)
  }else if(event.target.matches('#favorite-button, .fa-heart')){
    addToFavorite(Number(event.target.dataset.id))
  }
})

//modal_function////////////////////////////////////////////////////////
function userModal(event){
  const target = event.target
  const id = target.dataset.modalUserId
  const modalUserName = document.querySelector('#modal-user-name')
  const modalAvatar = document.querySelector('#modal-avatar')
  const modalUserInfo = document.querySelector('.modal-user-info')
    
    
    
  axios.get(INDEX_URL + id).then(response =>{
    const data = response.data
      // console.log(data)
    modalUserName.innerText = `${data.name} ${data.surname}`
    modalAvatar.innerHTML = `<img class='rounded mr-3' src="${data.avatar}" alt="User Avatar">`
    modalUserInfo.innerHTML = `
    <p>email :
    <span>${data.email}</span>
    </p>
    <p>gender :${data.gender}</p>
    <p>age :${data.age}</p>
    <p>region :${data.region}</p>
    <p>birthday :${data.birthday}</p>`
  })
}

//User渲染_function///////////////////////////////////
function renderUserCard(data){
  let HTMLcontent = ''
  data.forEach(item =>{
    HTMLcontent +=`
    <div class="card m-2">
      <img src="${item.avatar}" class="card-img-top" alt="user-avatar" data-modal-user-id="${item.id}" data-bs-toggle="modal" data-bs-target="#user-modal">
      <div class="card-body" data-modal-user-id="${item.id}" data-bs-toggle="modal" data-bs-target="#user-modal">
        <h5 class="card-title mb-0" data-modal-user-id="${item.id}">${item.name} ${item.surname}</h5>
      </div>
      
      <div class="card-footer text-muted ">
        <a href="#" class="btn btn-danger" id="favorite-button" data-id="${item.id}"><i class="fa-solid fa-heart" data-id="${item.id}"></i></a>
      </div>
    </div>`    
  })
  userPanel.innerHTML = HTMLcontent
}