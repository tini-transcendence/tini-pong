import animateGame from "../utils/animateGameModule.js";

let
document = window.document,
THREE = window.THREE,
num = null,

ARROW_UP = 38,
ARROW_DOWN = 40,

isArrowUpKeyDown = false,
isArrowDownKeyDown = false,

WIDTH = 1200,
HEIGHT = 900,

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
BOARD_COLOR = 0x4D37C6,

BALL_DEFAULT_VELOCITY_Z = 20,
BALL_RADIUS = 20,
BALL_VELOCITY_X = 0,
BALL_VELOCITY_Z = BALL_DEFAULT_VELOCITY_Z,
BALL_LOCATION_X = 0,
BALL_LOCATION_Y = 0,
BALL_LOCATION_Z = 0,
BALL_COLOR = 0xFFC85D,

PADDLE_DEFAULT_WIDTH = 200,
PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH,
PADDLE_HEIGHT = 30,
PADDLE_LENGTH = 30,
PADDLE_LOCATION_X = 0,
PADDLE_LOCATION_Y = 0,
PADDLE_LOCATION_Z = 0,
PADDLE_COLOR = 0xD30D5C,
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
paddle3,
paddle4,
last_winner = null,

paddle1_spead = 0,
paddle2_spead = 0,
paddle3_spead = 0,
paddle4_spead = 0,

difficulty = 0,

game = false,
end = false,

start_date,

player_1,
player_2,
player_3,
player_4,

player_number = null,

p1nickBoard,
scoreBoard,
p2nickBoard,

score = {
  player_left: 0,
  player_right: 0
};

function init(d, pn1, pn2, pn3, pn4)
{
  if (num)
    cancelAnimationFrame(num);
  setGameStatus(d, pn1, pn2, pn3, pn4);
  setScoreBoard()
  setGame();
  setDifficulty();
  setEvent();
  const dataToSend = {
    "action": "init",
  }
  window.websocket.send(JSON.stringify(dataToSend));
  start_date = Date();
  animateGame.setAnimateOn();
  loop();
}

function setGameStatus(d, pn1, pn2, pn3, pn4)
{
  game = false;
  end = false;
  player_1 = pn1;
  player_2 = pn2;
  player_3 = pn3;
  player_4 = pn4;
  difficulty = d;
  PADDLE_WIDTH = PADDLE_DEFAULT_WIDTH;
  paddle1_spead = 0;
  paddle2_spead = 0;
  paddle3_spead = 0;
  paddle4_spead = 0;
  score = {
    player_left: 0,
    player_right: 0
  };
}

function setScoreBoard()
{
  scoreBoard = document.querySelector('#scoreBoard');
  p1nickBoard = document.querySelector('#p1nickBoard');
  p2nickBoard = document.querySelector('#p2nickBoard');
  p1nickBoard.style.display = 'none';
  p1nickBoard.style.textAlign = 'left';
  p2nickBoard.style.display = 'none';
  p2nickBoard.style.textAlign = 'right';
  scoreBoard.innerHTML = 'Welcome! team left ('+ player_1 + ' ' + player_2 + ') vs team right (' + player_3 + ' ' + player_4 + ')! [key:up,down]';
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
  renderer.setClearColor(0xffffff, 1);
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
  paddle1.position.set(-BOARD_WIDTH / 4, 0, BOARD_LENGTH / 2 - PADDLE_LENGTH);
  paddle2 = addPaddle();
  paddle2.position.set(BOARD_WIDTH / 4, 0, BOARD_LENGTH / 2 - PADDLE_LENGTH);
  paddle3 = addPaddle();
  paddle3.position.set(-BOARD_WIDTH / 4, 0, -BOARD_LENGTH / 2 + PADDLE_LENGTH);
  paddle4 = addPaddle();
  paddle4.position.set(BOARD_WIDTH / 4, 0, -BOARD_LENGTH / 2 + PADDLE_LENGTH);

}

function addPaddle()
{
  let paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_LENGTH),
      paddleMaterial = new THREE.MeshLambertMaterial({ color: PADDLE_COLOR }),
      paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  scene.add(paddle);
  return paddle;
}

function setDifficulty()
{
  if (difficulty === 1)
  {
    BALL_VELOCITY_Z *= 0.8;
    PADDLE_WIDTH *= 1.2;
    paddle1.scale.set(1.2, 1, 1);
    paddle2.scale.set(1.2, 1, 1);
    paddle3.scale.set(1.2, 1, 1);
    paddle4.scale.set(1.2, 1, 1);
  }
  else if (difficulty === 2)
  {
    BALL_VELOCITY_Z = BALL_DEFAULT_VELOCITY_Z;
  }
  else if (difficulty === 3)
  {
    BALL_VELOCITY_Z *= 1.2;
    PADDLE_WIDTH *= 0.8;
    paddle1.scale.set(0.8, 1, 1);
    paddle2.scale.set(0.8, 1, 1);
    paddle3.scale.set(0.8, 1, 1);
    paddle4.scale.set(0.8, 1, 1);
  }
}

function setEvent()
{
  document.addEventListener('keydown', onlineContainerEventKeyDown);
  document.addEventListener('keyup', onlineContainerEventKeyUp);

  window.websocket.onclose = function (event) {
    window.websocket = undefined;
    if (game === true)
      console.log('게임 진행 도중 WebSocket 연결이 닫혔습니다.');
    else if (end === true)
      console.log('게임 종료 이후 WebSocket 연결이 닫혔습니다.');
    else
      console.log('게임 시작 직전 WebSocket 연결이 닫혔습니다.');
    end = true;
  };

  window.websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log('game : ', data["type"]);
    console.log(data);

    if (data["type"] === "init")
      player_number = data["player_number"];

    if (data["type"] === "win")
    {
      let win = data["msg"]["winner"]
      score.player_left = data["msg"]["score_p1"]
      score.player_right = data["msg"]["score_p2"]
      p1nickBoard.innerHTML = '';
      p1nickBoard.style.display = "none";
      p2nickBoard.innerHTML = '';
      p2nickBoard.style.display = "none";
      scoreBoard.innerHTML = win + ' Win! ' + 'Team L (' + player_1 + ', ' + player_2 + ')' + ':' + score.player_left + ", " + 'Team R (' + player_3 + ', ' + player_4 + ')' + ' : ' + score.player_right;
      stopBall();
      end = true;
    }

    if (data["type"] === "scored")
    {
      last_winner = data["msg"]["scored_p"]
      score.player_left = data["msg"]["score_p1"]
      score.player_right = data["msg"]["score_p2"]
      p1nickBoard.innerHTML = 'Team L (' + player_1 + ', ' + player_2 + ')';
      p1nickBoard.style.display = "block";
      scoreBoard.innerHTML = score.player_left + ' : ' + score.player_right;
      scoreBoard.style.fontWeight = "bold";
      p2nickBoard.innerHTML = 'Team R (' + player_3 + ', ' + player_4 + ')';
      p2nickBoard.style.display = "block";
      stopBall();
    }

    if (player_number !== 1 && data["type"] === "sync")
    {
      // 공 위치, 속도 동기화
      ball.position.x = data["obj"]["ball_loc"].x;
      ball.position.z = data["obj"]["ball_loc"].z;
      paddle1.position.x = (data["obj"]).paddle1_loc;
      paddle2.position.x = (data["obj"]).paddle2_loc;
      paddle3.position.x = (data["obj"]).paddle3_loc;
      paddle4.position.x = (data["obj"]).paddle4_loc;
    }

    if (data["type"] === "key_press")
    {
      if (data["player_number"] === 1)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle1_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle1_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle1_spead === -PADDLE_SPEAD)
              paddle1_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle1_spead === PADDLE_SPEAD)
              paddle1_spead = 0;
          }
        }
      }
      else if (data["player_number"] === 2)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle2_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle2_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle2_spead === -PADDLE_SPEAD)
              paddle2_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle2_spead === PADDLE_SPEAD)
              paddle2_spead = 0;
          }
        }
      }
      else if (data["player_number"] === 3)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle3_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle3_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle3_spead === -PADDLE_SPEAD)
              paddle3_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle3_spead === PADDLE_SPEAD)
              paddle3_spead = 0;
          }
        }
      }
      else if (data["player_number"] === 4)
      {
        if (data["event"] === "keydown")
        {
          if (data["key"] === ARROW_UP)
          {
            paddle4_spead = -PADDLE_SPEAD;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            paddle4_spead = PADDLE_SPEAD;
          }
        }
        else if (data["event"] === "keyup")
        {
          if (data["key"] === ARROW_UP)
          {
            if (paddle4_spead === -PADDLE_SPEAD)
              paddle4_spead = 0;
          }
          else if (data["key"] === ARROW_DOWN)
          {
            if (paddle4_spead === PADDLE_SPEAD)
              paddle4_spead = 0;
          }
        }
      }
    }
    else
      return;
    if (end === false)
    {
      game = true;
    }
  };
}

function onlineContainerEventKeyDown(e)
{
  if (isArrowUpKeyDown === false && e.keyCode === ARROW_UP)
  {
    isArrowUpKeyDown = true;
    // send key down arrow up
    const dataToSend = {
      "action": "key_press",
      "event": "keydown",
      "key": ARROW_UP,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else if (isArrowDownKeyDown === false && e.keyCode === ARROW_DOWN)
  {
    isArrowDownKeyDown = true;
    // send key down arrow down
    const dataToSend = {
      "action": "key_press",
      "event": "keydown",
      "key": ARROW_DOWN,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else
    return ;
}

function onlineContainerEventKeyUp(e)
{
  if (isArrowUpKeyDown === true && e.keyCode === ARROW_UP)
  {
    isArrowUpKeyDown = false;
    // send key up arrow up
    const dataToSend = {
      "action": "key_press",
      "event": "keyup",
      "key": ARROW_UP,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
  else if (isArrowDownKeyDown === true && e.keyCode === ARROW_DOWN)
  {
    isArrowDownKeyDown = false;
    // send key up arrow down
    const dataToSend = {
      "action": "key_press",
      "event": "keyup",
      "key": ARROW_DOWN,
      "obj": {
      },
    }
    window.websocket.send(JSON.stringify(dataToSend));
    e.preventDefault();
  }
}

function loop()
{
  num = requestAnimationFrame(loop);
  if (player_number === 1)
  {
    if (game === true && end === false)
      simulation_ball();
    simulation_paddle();
  }
  if (animateGame.getAnimate() === false)
    end = true;
  if (end === true)
  {
    stopBall();
    cancelAnimationFrame(num);
    num = null;
  }
  if (player_number === 1)
  {
    const dataToSend = {
      "action": "sync",
      "obj": {
        "ball_loc": ball.position,
        "paddle1_loc": paddle1.position.x,
        "paddle2_loc": paddle2.position.x,
        "paddle3_loc": paddle3.position.x,
        "paddle4_loc": paddle4.position.x,
      }
    }
    window.websocket.send(JSON.stringify(dataToSend));
  }
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

    else if(isPaddle2Collision()) {
      hitBallBack(paddle2);
    }

    if(isPaddle3Collision()) {
      hitBallBack(paddle3);
    }

    else if(isPaddle4Collision()) {
      hitBallBack(paddle4);
    }

    if(isPastPaddle1()) {
      scoreBy('player_right');
    }

    else if(isPastPaddle2()) {
      scoreBy('player_right');
    }

    if(isPastPaddle3()) {
      scoreBy('player_left');
    }

    else if(isPastPaddle4()) {
      scoreBy('player_left');
    }
  }
}

function startOneGame()
{
  let direction = 1;
  if (last_winner === null)
    direction = Math.random() > 0.5 ? -1 : 1;
  else
  {
    if (last_winner === 'player_left')
      direction = -1;
    else
      direction = 1;
  }
  ball.$velocity = {
    x: BALL_VELOCITY_X,
    z: direction * BALL_VELOCITY_Z
  };
}

function updateBallPosition()
{
  if (!isNaN(ball.$velocity.x))
    ball.position.x += ball.$velocity.x;
  if (!isNaN(ball.$velocity.z))
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
  return ball.position.z + BALL_RADIUS >= paddle2.position.z && isBallAlignedWithPaddle(paddle2);
}

function isPaddle3Collision()
{
  return ball.position.z - BALL_RADIUS <= paddle3.position.z && isBallAlignedWithPaddle(paddle3);
}

function isPaddle4Collision()
{
  return ball.position.z - BALL_RADIUS <= paddle4.position.z && isBallAlignedWithPaddle(paddle4);
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
  return ball.position.z > paddle2.position.z + PADDLE_LENGTH;
}

function isPastPaddle3()
{
  return ball.position.z < paddle3.position.z - PADDLE_LENGTH;
}

function isPastPaddle4()
{
  return ball.position.z < paddle4.position.z - PADDLE_LENGTH;
}

function scoreBy(playerName)
{
  addPoint(playerName);
  last_winner = playerName;
  stopBall();
  updateScoreBoard(playerName);
}

function updateScoreBoard(playerName) {
  let winner = '';
  let score_left = score.player_left;
  let score_right = score.player_right;

  if (score_left === 5) {
    winner = 1;
    end = true;
  } else if (score_right === 5) {
    winner = 2;
    end = true;
  } else {
    end = false;
  }

  if (end) {
    const dataToSend = {
      "action": "win",
      "msg": {
        "date": start_date,
        "winner": winner,
        "score_p1": score_left,
        "score_p2": score_right,
      },
    };
    window.websocket.send(JSON.stringify(dataToSend));

    document.removeEventListener('keydown', onlineContainerEventKeyDown);
    document.removeEventListener('keyup', onlineContainerEventKeyUp);
  } else {
    const dataToSend = {
      "action": "scored",
      "msg": {
        "scored_p": playerName,
        "score_p1": score_left,
        "score_p2": score_right,
      },
    };
    window.websocket.send(JSON.stringify(dataToSend));
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
  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle1.position.x + paddle1_spead && paddle1.position.x + paddle1_spead < -PADDLE_WIDTH / 3 + 0)
    paddle1.position.x += paddle1_spead;

  if (PADDLE_WIDTH / 3 + 0 < paddle2.position.x + paddle2_spead && paddle2.position.x + paddle2_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle2.position.x += paddle2_spead;

  if (PADDLE_WIDTH / 2 + -BOARD_WIDTH / 2 < paddle3.position.x + paddle3_spead && paddle3.position.x + paddle3_spead < -PADDLE_WIDTH / 3 + 0)
    paddle3.position.x += paddle3_spead;

  if (PADDLE_WIDTH / 3 + 0 < paddle4.position.x + paddle4_spead && paddle4.position.x + paddle4_spead < -PADDLE_WIDTH / 2 + BOARD_WIDTH / 2)
    paddle4.position.x += paddle4_spead;
}

export { init, onlineContainerEventKeyUp, onlineContainerEventKeyDown }
