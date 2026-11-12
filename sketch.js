// 宣告全域變數來儲存待機（stop）、行走（walk）、施法（magic）與跳躍（jump）的精靈圖片
let stopSheet;
let walkSheet;
let magicSheet;
let jumpSheet;

// 宣告陣列來儲存切割後的每一幀圖片
let stopFrames = [];
let walkFrames = [];
let magicFrames = [];
let jumpFrames = [];

// 設定待機精靈圖（1/stop/stop.png）規格：共 8 張，總寬 467，高 95
const stopTotalFrames = 8;
const stopSheetWidth = 467;
const stopSheetHeight = 95;
const stopFrameWidth = stopSheetWidth / stopTotalFrames;
const stopFrameHeight = stopSheetHeight;

// 設定行走精靈圖（1/walk/walk.png）規格：共 10 張，總寬 825，高 91
const walkTotalFrames = 10;
const walkSheetWidth = 825;
const walkSheetHeight = 91;
const walkFrameWidth = walkSheetWidth / walkTotalFrames;
const walkFrameHeight = walkSheetHeight;

// 設定施法精靈圖（1/magic/magic.png）規格：共 10 張，總寬 615，高 96
const magicTotalFrames = 10;
const magicSheetWidth = 615;
const magicSheetHeight = 96;
const magicFrameWidth = magicSheetWidth / magicTotalFrames;
const magicFrameHeight = magicSheetHeight;

// 設定跳躍精靈圖（1/jump/jump.png）規格：共 5 張，總寬 410，高 86
const jumpTotalFrames = 5;
const jumpSheetWidth = 410;
const jumpSheetHeight = 86;
const jumpFrameWidth = jumpSheetWidth / jumpTotalFrames;
const jumpFrameHeight = jumpSheetHeight;

// 宣告變數記錄角色目前播放的幀數索引
let currentFrame = 0;

// 宣告變數管理角色狀態：'stop'（待機）、'walk'（行走）、'magic'（施法）、'jump'（跳躍）
let currentState = 'stop';
// 宣告變數管理角色面向方向：1 代表朝右，-1 代表朝左
let facing = 1;
// 宣告變數儲存角色 1 的中心點 X 座標
let charX;
// 宣告角色移動的速度（每幀移動的像素距離）
const moveSpeed = 12;

// 跳躍物理相關變數
let jumpY = 0;          // 角色相對於地面的垂直位移量（負數代表往上）
let jumpVelocity = 0;   // 垂直速度
const gravity = 1.8;    // 重力加速度
const jumpForce = -22;  // 起跳的瞬間向上推力

// preload() 函式會在 setup() 之前執行，確保所有外部圖片資源完全載入
function preload() {
  stopSheet = loadImage('1/stop/stop.png');
  walkSheet = loadImage('1/walk/walk.png');
  magicSheet = loadImage('1/magic/magic.png');
  jumpSheet = loadImage('1/jump/jump.png');
}

// setup() 函式在程式開始時執行一次，用於初始化設定
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12); // 設定動畫影格率

  // 初始化角色 1 的中心 X 座標在畫布寬度的 2/3 位置
  charX = width * (2 / 3);

  // 切割待機精靈圖（8 張）
  for (let i = 0; i < stopTotalFrames; i++) {
    stopFrames.push(stopSheet.get(i * stopFrameWidth, 0, stopFrameWidth, stopFrameHeight));
  }

  // 切割行走精靈圖（10 張）
  for (let i = 0; i < walkTotalFrames; i++) {
    walkFrames.push(walkSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight));
  }

  // 切割施法精靈圖（10 張）
  for (let i = 0; i < magicTotalFrames; i++) {
    magicFrames.push(magicSheet.get(i * magicFrameWidth, 0, magicFrameWidth, magicFrameHeight));
  }

  // 切割跳躍精靈圖（5 張）
  for (let i = 0; i < jumpTotalFrames; i++) {
    jumpFrames.push(jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight));
  }
}

// draw() 函式不斷重複執行，負責更新狀態、移動、跳躍物理與繪製角色
function draw() {
  background('#C89D54'); // 設定土黃色背景

  // 1. 角色狀態與移動邏輯控制
  if (currentState === 'jump') {
    // 處理跳躍過程中的物理運動（重力加速度與位移更新）
    jumpVelocity += gravity;
    jumpY += jumpVelocity;

    // 當角色落地（jumpY 大於或等於 0）時，結束跳躍並恢復待機狀態
    if (jumpY >= 0) {
      jumpY = 0;
      jumpVelocity = 0;
      currentState = 'stop';
      currentFrame = 0;
    }
  } else if (currentState === 'magic') {
    // 當處於施法狀態時，等待施法動畫播畢
    if (currentFrame >= magicTotalFrames - 1) {
      currentState = 'stop';
      currentFrame = 0;
    }
  } else {
    // 一般情況下偵測左右方向鍵
    if (keyIsDown(RIGHT_ARROW)) {
      currentState = 'walk';
      facing = 1;
      charX += moveSpeed;
    } else if (keyIsDown(LEFT_ARROW)) {
      currentState = 'walk';
      facing = -1;
      charX -= moveSpeed;
    } else {
      currentState = 'stop';
    }
  }

  // 2. 根據目前狀態選定對應的圖片陣列與尺寸參數
  let activeFrames, activeTotalFrames, activeFrameWidth, activeFrameHeight;
  if (currentState === 'jump') {
    activeFrames = jumpFrames;
    activeTotalFrames = jumpTotalFrames;
    activeFrameWidth = jumpFrameWidth;
    activeFrameHeight = jumpFrameHeight;
  } else if (currentState === 'magic') {
    activeFrames = magicFrames;
    activeTotalFrames = magicTotalFrames;
    activeFrameWidth = magicFrameWidth;
    activeFrameHeight = magicFrameHeight;
  } else if (currentState === 'walk') {
    activeFrames = walkFrames;
    activeTotalFrames = walkTotalFrames;
    activeFrameWidth = walkFrameWidth;
    activeFrameHeight = walkFrameHeight;
  } else {
    activeFrames = stopFrames;
    activeTotalFrames = stopTotalFrames;
    activeFrameWidth = stopFrameWidth;
    activeFrameHeight = stopFrameHeight;
  }

  // 動畫影格索引計算（跳躍與施法為單次播放，其餘循環播放）
  if (currentState !== 'magic' && currentState !== 'jump') {
    currentFrame = currentFrame % activeTotalFrames;
  }

  // 3. 計算角色顯示尺寸與位置
  let displayHeight = height / 3;
  let scaleRatio = displayHeight / activeFrameHeight;
  let displayWidth = activeFrameWidth * scaleRatio;
  
  // 基礎底部 Y 座標加上跳躍的垂直位移量 (jumpY)
  let posY = (height - displayHeight) + jumpY;

  let halfWidth = displayWidth / 2;
  charX = constrain(charX, halfWidth, width - halfWidth);

  // 4. 繪製角色 1
  push();
  translate(charX, posY);
  scale(facing, 1);
  imageMode(CENTER);
  image(activeFrames[currentFrame], 0, displayHeight / 2, displayWidth, displayHeight);
  pop();

  // 5. 動畫幀數推進
  if (currentState === 'magic') {
    if (currentFrame < magicTotalFrames - 1) {
      currentFrame++;
    }
  } else if (currentState === 'jump') {
    // 跳躍動作依照 5 張圖片進度分配（隨著垂直位置或固定影格推進）
    // 這裡依據落地前的進度自動對應到 5 張跳躍圖的某一幀
    let jumpProgress = map(jumpY, 0, -200, 0, jumpTotalFrames - 1, true);
    currentFrame = floor(constrain(jumpProgress, 0, jumpTotalFrames - 1));
  } else {
    currentFrame = (currentFrame + 1) % activeTotalFrames;
  }
}

// keyPressed() 函式：處理按鍵瞬間觸發的事件
function keyPressed() {
  // 當按下空白鍵（SPACEBAR）時觸發施法
  if (key === ' ' || keyCode === 32) {
    if (currentState !== 'magic' && currentState !== 'jump') {
      currentState = 'magic';
      currentFrame = 0;
    }
  }
  // 當按下往上方向鍵（UP_ARROW）時觸發跳躍
  else if (keyCode === UP_ARROW) {
    // 確保不在跳躍中時才能起跳
    if (currentState !== 'jump') {
      currentState = 'jump';
      jumpVelocity = jumpForce; // 給予向上的初速度
      currentFrame = 0;
    }
  }
}

// windowResized() 函式：視窗大小改變時維持角色相對位置
function windowResized() {
  let ratioX = charX / width;
  resizeCanvas(windowWidth, windowHeight);
  charX = width * ratioX;
}