//運用MVC架構 : controller、model、view 
// 牌面圖案資料
const Symbols = [
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png',//黑桃
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
  ]

  // 迴圈亂數產生52張牌
const utility = {
  getRandomNumber(count){
    const number = Array.from(Array(count).keys())
    // console.log(number) 測試用
    for (let index = number.length - 1; index > 0; index--){
      const randomIndex = Math.floor(Math.random() * (index+1))
      ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

// 設定遊戲狀態(5種)
const GAME_STATE = {
  FirstCardAwaits : 'FirstCardAwaits',
  SecondCardAwaits : 'SecondCardAwaits',
  CardMatchFailed : 'CardMatchFailed',
  CardMatched : 'CardMatched',
  GameFinished : 'GameFinished'
}


// 宣告遊戲狀態(controller)
const controller = {
  currentState : GAME_STATE.FirstCardAwaits,
  generateCards(){
    view.displayCards(utility.getRandomNumber(52))
  },
  dispatchCardAction(card){
    if (!card.classList.contains('back')){
      return
    }
    switch(this.currentState){
      case GAME_STATE.FirstCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break //若用return，則會回傳跳出，用break則會繼續

      case GAME_STATE.SecondCardAwaits :
        view.flipCard(card)
        model.revealedCards.push(card)
        if (model.isRevealedCardsMatched()){
          this.currentState = GAME_STATE.CardMatched
          view.pairCard(model.revealedCards[0])
          view.pairCard(model.revealedCards[1])
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits
        }else {
          this.currentState = GAME_STATE.CardMatchFailed
          setTimeout(() =>{
            view.flipCard(model.revealedCards[0])
            view.flipCard(model.revealedCards[1])
            model.revealedCards = []
            this.currentState = GAME_STATE.FirstCardAwaits
          },1000)
        }
        break
    }
    console.log('current_State:',this.currentState)
    console.log('revealed_Card:',model.revealedCards.map(card => {return card.dataset.index}))

  }
}

// 宣告遊戲資料(model)
const model = {
  revealedCards : [],
  isRevealedCardsMatched () {
   return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  }
}


// 宣告顯示(view)
const view = {
  //取得牌背
  getCardElement(index){
    return`<div class="card back" data-index=${index}></div>`
  },
  //取得牌面
  getCardContent(index){
    const number = this.transferNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>`
  },
  // 翻牌
    flipCard(card){
      // console.log(card)
      // 回傳正面
      if (card.classList.contains('back')){
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
  },
  transferNumber(number){
    switch(number){
      case 1 :
        return 'A'
      case 11 :
        return 'J'
      case 12 :
        return 'Q'
      case 13 :
        return 'K'
      default :
      return number
    }
  },
  pairCard(card){
    card.classList.add('paired')
  },
  displayCards(indexes){
    const rootElement = document.querySelector('#cards')

    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
    //增加筆記join()
  }
}


controller.generateCards()
// console.log(utility.getNumberRandom(10))

// 之後確認document.querySelectorAll('.card')是否裝進一變數比較好
// 點擊監聽
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})

// 翻太快會有錯誤

