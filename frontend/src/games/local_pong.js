let
local = true,
online = false,
document = window.document,
THREE = window.THREE,

ARROW_LEFT = 37,
ARROW_UP = 38,
ARROW_RIGHT = 39,
ARROW_DOWN = 40,
KEY_W = 87,
KEY_A = 65,
KEY_R = 82,
KEY_S = 83,
KEY_D = 68,

KEY_E = 69,
KEY_N = 78,
KEY_H = 72,

WIDTH = 800,
HEIGHT = 600,

CAMERA_LOCATION_X = 1000,
CAMERA_LOCATION_Y = 3000,
CAMERA_LOCATION_Z = 0,
CAMERA_LOOKAT_X = 0,
CAMERA_LOOKAT_Y = 0,
CAMERA_LOOKAT_Z = 0,
CAMERA_FOV = 45,
CAMERA_ASPECT = WIDTH / HEIGHT,
CAMERA_NEAR = 0.1,
CAMERA_FAR = 10000,

LIGHT_LOCATION_X = 0,
LIGHT_LOCATION_Y = 100,
LIGHT_LOCATION_Z = 0,
LIGHT_COLOR = 0xffffff,

BOARD_WIDTH = 1400,
BOARD_HEIGHT = 10,
BOARD_LENGTH = 3000,
BOARD_LOCATION_X = 0,
BOARD_LOCATION_Y = -50,
BOARD_LOCATION_Z = 0,
BOARD_COLOR = 0x6666ff,

BALL_RADIUS = 20,
BALL_VELOCITY_X = 0,
BALL_VELOCITY_Z = 20,
BALL_LOCATION_X = 0,
BALL_LOCATION_Y = 0,
BALL_LOCATION_Z = 0,
BALL_COLOR = 0xff0000,

PADDLE_DEFAULT_WIDTH = 200,
PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH,
PADDLE_HEIGHT = 30,
PADDLE_LENGTH = 30,
PADDLE_LOCATION_X = 0,
PADDLE_LOCATION_Y = 0,
PADDLE_LOCATION_Z = 0,
PADDLE_COLOR = 0xffffff,
PADDLE_SPEAD = 10,

container,
renderer,
mainLight,
camera,
scene,
board,
ball,
paddle1,
paddle2,

paddle1_spead = 0,
paddle2_spead = 0,

difficulty = 0,

game = false,
end = false,

scoreBoard,
score = {
  player1: 0,
  player2: 0
};

function init()
{
  setScoreBoard()
  setGame();
  setEvent();
  loop();
}

function setScoreBoard()
{
  scoreBoard = document.getElementById('scoreBoard');
  scoreBoard.innerHTML = 'Welcome! Select difficulty (E/N/H)';
}

function setGame()
{
  setRenderer();
  setScene();
  setLight();
  setCamera();
  setBoard();
  setBall();
  setPaddle();
}

function setRenderer()
{
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x9999BB, 1);
  container.appendChild(renderer.domElement);
}

function setScene()
{
  scene = new THREE.Scene();
}

function setLight()
{
  mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
  scene.add(mainLight);
}

function setCamera()
{
  camera = new THREE.PerspectiveCamera(CAMERA_FOV, CAMERA_ASPECT, CAMERA_NEAR, CAMERA_FAR);
  camera.position.set(CAMERA_LOCATION_X, CAMERA_LOCATION_Y, CAMERA_LOCATION_Z);
  camera.lookAt(CAMERA_LOOKAT_X,CAMERA_LOOKAT_Y,CAMERA_LOOKAT_Z);
  scene.add(camera);
}

function setBoard()
{
  let boardGeometry = new THREE.BoxGeometry(BOARD_WIDTH, BOARD_HEIGHT, BOARD_LENGTH),
      boardMaterial = new THREE.MeshLambertMaterial({ color: BOARD_COLOR });
  board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.set(BOARD_LOCATION_X, BOARD_LOCATION_Y, BOARD_LOCATION_Z);
  scene.add(board);
}

function setBall()
{
  let ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
      ballMaterial = new THREE.MeshLambertMaterial({ color: BALL_COLOR });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(BALL_LOCATION_X, BALL_LOCATION_Y, BALL_LOCATION_Z)
  scene.add(ball);
}

function setPaddle()
{
  paddle1 = addPaddle();
  paddle1.position.z = BOARD_LENGTH / 2;
  paddle2 = addPaddle();
  paddle2.position.z = -BOARD_LENGTH / 2;
}

function addPaddle()
{
  let paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_LENGTH),
      paddleMaterial = new THREE.MeshLambertMaterial({ color: PADDLE_COLOR }),
      paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  scene.add(paddle);
  return paddle;
}

function setEvent()
{
  document.addEventListener('keydown', containerEventKeyDown);
  document.addEventListener('keyup', containerEventKeyUp);
}

function containerEventKeyDown(e)
{
  if (end == true)
  {
    if (e.keyCode === KEY_R)
    {
      scoreBoard.innerHTML = 'Welcome! Select difficulty (E/N/H)';
      BALL_VELOCITY_Z = 20;
      if (difficulty === 1)
      {
        PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH;
        paddle1.scale.set(1, 1, 1);
        paddle2.scale.set(1, 1, 1);
      }
      if (difficulty === 3)
      {
        PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH;
        paddle1.scale.set(1, 1, 1);
        paddle2.scale.set(1, 1, 1);
      }
      difficulty = 0;
      score = {
        player1: 0,
        player2: 0
      };
      paddle1.position.x = 0;
      paddle2.position.x = 0;
      end = false;
    }
  }
  else if (difficulty === 0)
  {
    if (e.keyCode === KEY_E)
    {
      difficulty = 1;
      BALL_VELOCITY_Z *= 0.8;
      PADDLE_WIDTH *= 1.2;
      paddle1.scale.set(1.2, 1, 1);
      paddle2.scale.set(1.2, 1, 1);
      e.preventDefault();
    }
    else if (e.keyCode === KEY_N)
    {
      difficulty = 2;
      BALL_VELOCITY_Z = 20;
      e.preventDefault();
    }
    else if (e.keyCode === KEY_H)
    {
      difficulty = 3;
      BALL_VELOCITY_Z *= 1.2;
      PADDLE_WIDTH *= 0.8;
      paddle1.scale.set(0.8, 1, 1);
      paddle2.scale.set(0.8, 1, 1);
      e.preventDefault();
    }
    else 
      return ;
    scoreBoard.innerHTML = 'Press the key to start! (w,s)(up,down)';
  }
  else
  {
    if (e.keyCode === KEY_W)
    {
      paddle1_spead = -PADDLE_SPEAD;
      e.preventDefault();
    }
    else if (e.keyCode === KEY_S)
    {
      paddle1_spead = PADDLE_SPEAD;
      e.preventDefault();
    }
    else if (e.keyCode === ARROW_UP)
    {
      paddle2_spead = -PADDLE_SPEAD;
      e.preventDefault();
    }
    else if (e.keyCode === ARROW_DOWN)
    {
      paddle2_spead = PADDLE_SPEAD;
      e.preventDefault();
    }
    else
      return ;
    if (game === false && end === false)
    {
      updateScoreBoard();
      game = true;
    }
  }
}

function containerEventKeyUp(e)
{
  if (e.keyCode === KEY_W)
  {
    if (paddle1_spead === -PADDLE_SPEAD)
      paddle1_spead = 0;
    e.preventDefault();
  }
  if (e.keyCode === KEY_S)
  {
    if (paddle1_spead === PADDLE_SPEAD)
      paddle1_spead = 0;
    e.preventDefault();
  }
  if (e.keyCode === ARROW_UP)
  {
    if (paddle2_spead === -PADDLE_SPEAD)
      paddle2_spead = 0;
    e.preventDefault();
  }
  if (e.keyCode === ARROW_DOWN)
  {
    if (paddle2_spead === PADDLE_SPEAD)
      paddle2_spead = 0;
    e.preventDefault();
  }
}

function loop()
{
  requestAnimationFrame(loop);
  if (game === true && end === false)
    simulation_ball();
  simulation_paddle();
  renderer.render(scene, camera);
}

function simulation_ball()
{
  if(game === true) {
    if(ball.$velocity == null) {
      startOneGame();
    }
    
    updateBallPosition();
    
    if(isSideCollision()) {
      ball.$velocity.x *= -1; 
    }
    
    if(isPaddle1Collision()) {
      hitBallBack(paddle1);
    }
    
    if(isPaddle2Collision()) {
      hitBallBack(paddle2);
    }
    
    if(isPastPaddle1()) {
      scoreBy('player2');
    }
    
    if(isPastPaddle2()) {
      scoreBy('player1');
    }
  }
}

function startOneGame()
{
  let direction = Math.random() > 0.5 ? -1 : 1;
  ball.$velocity = {
    x: BALL_VELOCITY_X,
    z: direction * BALL_VELOCITY_Z
  };
}

function updateBallPosition()
{
  ball.position.x += ball.$velocity.x;
  ball.position.z += ball.$velocity.z;
}

function isSideCollision()
{
  let halfBoardWidth = BOARD_WIDTH / 2;
  return ball.position.x - BALL_RADIUS < -halfBoardWidth || ball.position.x + BALL_RADIUS > halfBoardWidth;
}

function isPaddle1Collision()
{
  return ball.position.z + BALL_RADIUS >= paddle1.position.z && isBallAlignedWithPaddle(paddle1);
}

function isPaddle2Collision()
{
  return ball.position.z - BALL_RADIUS <= paddle2.position.z && isBallAlignedWithPaddle(paddle2);
}

function isBallAlignedWithPaddle(paddle)
{
  let halfPaddleWidth = PADDLE_WIDTH / 2
  return ball.position.x > paddle.position.x - halfPaddleWidth && ball.position.x < paddle.position.x + halfPaddleWidth;
}

function hitBallBack(paddle)
{
  ball.$velocity.x = (ball.position.x - paddle.position.x) / 5; 
  ball.$velocity.z *= -1;
}

function isPastPaddle1()
{
  return ball.position.z > paddle1.position.z + PADDLE_LENGTH;
}

function isPastPaddle2()
{
  return ball.position.z < paddle2.position.z - PADDLE_LENGTH;
}

function scoreBy(playerName)
{
  addPoint(playerName);
  stopBall();
  updateScoreBoard();
}

function updateScoreBoard()
{
  end = true;
  if (score.player1 === 5)
    scoreBoard.innerHTML = 'Player 1 Win! [r] to regame';
  else if (score.player2 === 5)
    scoreBoard.innerHTML = 'Player 2 Win! [r] to regmae';
  else
  {
    scoreBoard.innerHTML = 'Player 1: ' + score.player1 + ' Player 2: ' + score.player2;
    end = false;
  }
}

function stopBall()
{
  ball.position.set(0,0,0);
  ball.$velocity = null;
  game = false;
}

function addPoint(playerName)
{
  score[playerName]++;
  console.log(score);
}

function simulation_paddle()
{
  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle1.position.x + paddle1_spead && paddle1.position.x + paddle1_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle1.position.x += paddle1_spead;

  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle2.position.x + paddle2_spead && paddle2.position.x + paddle2_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle2.position.x += paddle2_spead;
}

export default init