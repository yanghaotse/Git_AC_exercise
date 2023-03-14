const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/" //後接USER id
const userPanel = document.querySelector('#user-container')
const userList = JSON.parse(localStorage.getItem('favoriteList')) ||[]
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const searchButton = document.querySelector('#search-button')
const cardFooter = document.querySelector('.card-footer')
// axios.get(INDEX_URL).then(response =>{
//   userList.push(...response.data.results)
//   // console.log(userList)
//   renderUserCard(userList)
// }).catch(error => {
//   console.log(error)
// })

function removeFavorite(id){
  if( !userList || userList.length === 0 ){
    return
  }
  const userListIndex = userList.findIndex((user) => user.id === id)
  if( userListIndex === -1){
    return
  }
  userList.splice(userListIndex,1)
  localStorage.setItem('favoriteList',JSON.stringify(userList))
  renderUserCard(userList)
}

// 取消收藏_監聽器//////////////////////////////////////////
// cardFooter.addEventListener('click',function onFavoriteButtonClick(event){

//   if(event.target.matches('#remove-favorite-button, .fa-heart-crack')){
//     removeFavorite(Number(event.target.dataset.id))
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
  renderUserCard(filterUser)
})



// 點擊_監聽器//////////////////////////////////////////////////

userPanel.addEventListener('click',function onPanelClick(event){
  if (event.target.matches('.card-body, .card-img-top, .card-title')){
    userModal(event)
  }else if(event.target.matches('#remove-favorite-button, .fa-solid')){
    removeFavorite(Number(event.target.dataset.id))
  }
})

//modal_function////////////////////////////////////////////////////////
function userModal(event){
  const target = event.target
  const id = target.dataset.modalUserId
  // if(target.matches('.card-body, .card-img-top, .card-title')){
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
    <p>birthday :${data.birthday}</p>
      `
      // cardFooter.innerHTML = `<a href="#" class="btn btn-danger" id="remove-favorite-button" data-id="${data.id}"><i class="fa-solid fa-heart-crack" data-id="${data.id}"></i></a>`
  })
  // }
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
        <a href="#" class="btn btn-danger" id="remove-favorite-button" data-id="${item.id}"><i class="fa-solid fa-xmark" data-id="${item.id}"></i></a>
      </div>
    </div>`    
  })
  userPanel.innerHTML = HTMLcontent
}
renderUserCard(userList)