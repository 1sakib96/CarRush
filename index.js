document.addEventListener("DOMContentLoaded", () => {

  const game = document.getElementById("game")
  const player = document.getElementById("player")

  const scoreEl = document.getElementById("score")
  const coinEl = document.getElementById("coins")
  const gameOverText = document.getElementById("gameOver")

  const leftBtn = document.getElementById("leftBtn")
  const rightBtn = document.getElementById("rightBtn")
  const resetBtn = document.getElementById("resetBtn")

  const startScreen = document.getElementById("startScreen")
  const startBtn = document.getElementById("startBtn")

  let lanes = []
  let lane = 1

  let enemies = []
  let coins = []

  let speed = 5
  let score = 0
  let coinScore = 0
  let running = false

  let enemyTimer
  let coinTimer
  let difficultyTimer

  let enemiesPerSpawn = 1
  let spawnRate = 1200

  // Enemy car images – replace with your own images if needed
  const enemyImages = [
    "enemy_car1.png",
    "enemy_car2.png",
    "truck.png"
  ]

  /* CALCULATE LANES */
  function calculateLanes() {
    const gameWidth = game.offsetWidth
    const laneWidth = gameWidth / 4
    lanes = []
    for (let i = 0; i < 4; i++) {
      lanes.push(i * laneWidth + laneWidth / 2 - player.offsetWidth / 2)
    }
    player.style.left = lanes[lane] + "px"
  }

  window.addEventListener("resize", calculateLanes)
  calculateLanes()

  /* SPAWN ENEMY */
  function spawnEnemy() {
    if (!running) return
    const safeLane = Math.floor(Math.random() * 4)
    for (let i = 0; i < Math.floor(enemiesPerSpawn); i++) {
      let laneIndex
      do {
        laneIndex = Math.floor(Math.random() * 4)
      } while (laneIndex === safeLane)

      const enemy = document.createElement("div")
      enemy.classList.add("enemy")
      enemy.style.left = lanes[laneIndex] + "px"
      enemy.style.top = "-120px"

      const img = enemyImages[Math.floor(Math.random() * enemyImages.length)]
      enemy.style.backgroundImage = `url(${img})`
      enemy.style.backgroundSize = "cover"
      enemy.style.backgroundRepeat = "no-repeat"

      game.appendChild(enemy)
      enemies.push(enemy)
    }
  }

  /* SPAWN COIN */
  function spawnCoin() {
    if (!running) return
    const coin = document.createElement("div")
    coin.classList.add("coin")

    const laneIndex = Math.floor(Math.random() * 4)
    coin.style.left = lanes[laneIndex] + "px"
    coin.style.top = "-60px"
    coin.style.backgroundImage = `url('coin2.png')`
    coin.style.backgroundSize = "cover"
    coin.style.backgroundRepeat = "no-repeat"

    game.appendChild(coin)
    coins.push(coin)
  }

  /* COLLISION DETECTION */
  function collide(a, b) {
    const r1 = a.getBoundingClientRect()
    const r2 = b.getBoundingClientRect()
    return !(
      r1.top > r2.bottom ||
      r1.bottom < r2.top ||
      r1.left > r2.right ||
      r1.right < r2.left
    )
  }

  /* GAME LOOP */
  function gameLoop() {
    if (!running) return

    enemies.forEach((enemy, i) => {
      enemy.style.top = enemy.offsetTop + speed + "px"
      if (enemy.offsetTop > window.innerHeight) {
        enemy.remove()
        enemies.splice(i, 1)
      }
      if (collide(player, enemy)) crash()
    })

    coins.forEach((coin, i) => {
      coin.style.top = coin.offsetTop + speed + "px"
      if (coin.offsetTop > window.innerHeight) {
        coin.remove()
        coins.splice(i, 1)
      }
      if (collide(player, coin)) {
        coin.remove()
        coins.splice(i, 1)
        coinScore++
        coinEl.innerText = coinScore
      }
    })

    score++
    scoreEl.innerText = score

    requestAnimationFrame(gameLoop)
  }

  /* CRASH */
  function crash() {
    running = false
    gameOverText.style.display = "block"
  }

  /* PLAYER MOVEMENT */
  function moveLeft() {
    if (!running) return
    lane--
    if (lane < 0) lane = 0
    player.style.left = lanes[lane] + "px"
  }

  function moveRight() {
    if (!running) return
    lane++
    if (lane > 3) lane = 3
    player.style.left = lanes[lane] + "px"
  }

  /* CONTROLS */
  leftBtn.onclick = moveLeft
  rightBtn.onclick = moveRight
  resetBtn.onclick = resetGame

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "a") moveLeft()
    if (e.key === "ArrowRight" || e.key === "d") moveRight()
    if (e.key === "r") resetGame()
  })

  /* INCREASE DIFFICULTY */
  function increaseDifficulty() {
    if (enemiesPerSpawn < 3) enemiesPerSpawn += 0.5
    speed += 0.2
  }

  /* START GAME */
  function startGame() {
    startScreen.style.display = "none"
    running = true
    enemyTimer = setInterval(spawnEnemy, spawnRate)
    coinTimer = setInterval(spawnCoin, 2000)
    difficultyTimer = setInterval(increaseDifficulty, 10000)
    requestAnimationFrame(gameLoop)
  }

  startBtn.onclick = startGame

  /* RESET GAME */
  function resetGame() {
    clearInterval(enemyTimer)
    clearInterval(coinTimer)
    clearInterval(difficultyTimer)

    enemies.forEach(e => e.remove())
    coins.forEach(c => c.remove())

    enemies = []
    coins = []
    score = 0
    coinScore = 0
    speed = 5
    enemiesPerSpawn = 1
    lane = 1

    scoreEl.innerText = 0
    coinEl.innerText = 0
    player.style.left = lanes[lane] + "px"

    gameOverText.style.display = "none"
    running = false
    startScreen.style.display = "flex"
  }

})
