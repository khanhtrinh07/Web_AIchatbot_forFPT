// Khai báo biến để lưu trữ đối tượng chatbox và tin nhắn
const chatMessageColumn = document.getElementById("chat-message-column");
const messageInputField = document.getElementById("message-input-field");



// Hàm gửi tin nhắn
function sendMessageToChatbox() {
  // Lấy giá trị của tin nhắn và tạo phần tử div mới cho nội dung tin nhắn
  const messageContent = messageInputField.value;
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  const messageText = document.createElement("p");
  messageText.classList.add("message-user");
  
  messageText.textContent = messageContent;
  newMessage.appendChild(messageText);
  // Thêm tin nhắn mới vào chatbox
  chatMessageColumn.appendChild(newMessage);
  
  // Gửi yêu cầu AJAX đến máy chủ Flask để nhận phản hồi từ chatbot
  const xhr = new XMLHttpRequest();
  const url = "/predict";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText)["response"];
      const chatbotMessage = document.createElement("div");
      chatbotMessage.classList.add("message-chatbot");
      const chatbotMessageText = document.createElement("p");
      chatbotMessageText.classList.add("message-text");
      chatbotMessageText.textContent = response;
      chatbotMessage.appendChild(chatbotMessageText);
      chatMessageColumn.appendChild(chatbotMessage);
    }
  };
  const data = JSON.stringify({"message": messageContent});
  xhr.send(data);
  
  // Xóa nội dung của tin nhắn sau khi đã gửi
  messageInputField.value = "";
}

// Lắng nghe sự kiện khi nhấn phím Enter
messageInputField.addEventListener("keyup", function(event) {
  // Kiểm tra nếu phím nhấn là phím Enter thì gửi tin nhắn
  if (event.key === "Enter") {
    sendMessageToChatbox();
  }
});

// Lấy thẻ button gửi tin nhắn
const sendButton = document.getElementById('send-message-button');

// Xử lý khi người dùng gửi tin nhắn bằng cách nhấn nút gửi
sendButton.addEventListener('click', function() {
  sendMessageToChatbox();
});

// Xử lý khi người dùng nhập liệu vào trường nhập liệu của chatbot
messageInputField.addEventListener('input', function() {
  // Thêm hiệu ứng thay đổi kích thước và màu sắc cho trường nhập liệu khi người dùng nhập liệu
  if (this.value) {
    this.style.backgroundColor = '#fff';
    this.style.fontSize = '20px';
    this.style.padding = '20px';
  } else {
    this.style.backgroundColor = '#f9f9f9';
    this.style.fontSize = '16px';
    this.style.padding = '16px';
  }
});

// Lấy thẻ cửa sổ chat và thẻ cuộn
const chatMessageWindow = document.getElementById('chat-message-window');

// Tự động cuộn lên khi có tin nhắn mới được thêm vào cuối cùng của cửa sổ chat
function scrollToBottom() {
  chatMessageWindow.scrollTop = chatMessageColumn.clientHeight;
}

// Xử lý khi người dùng gửi tin nhắn bằng cách nhấn nút gửi
sendButton.addEventListener('click', function() {
  sendMessageToChatbox();
  scrollToBottom(); // Tự động cuộn lên khi có tin nhắn mới được thêm vào cuối cùng của cửa sổ chat
});


const LETTER_POOL = getEl('letter-pool'),
TEMP_LETTER_POOL = getEl('temp-letter-pool'),
LETTER_OVERLAY = getEl('letter-overlay'),
CHAT_MESSAGE_COLUMN_WRAPPER = getEl('chat-message-column-wrapper'),
CHAT_MESSAGE_COLUMN = getEl('chat-message-column'),
MESSAGE_INPUT = getEl('message-input'),
MESSAGE_INPUT_FIELD = getEl('message-input-field'),
CHAT_BOT_MOOD = getEl('chat-bot-mood'),
CHAT_BOT_MOOD_VALUE = getEl('chat-bot-mood-value');
const chatbotmood = document.getElementById("chat-bot-mood")
console.log(chatbotmood)
const STATE = {
  isUserSendingMessage: false,
  isChatBotSendingMessage: false,
  letterPool: {
    transitionPeriod: 30000,
    intervals: [] },

  moods: ['friendly', 'suspicious', 'boastful'],
  currentMood: '',
  chatbotMessageIndex: 0,
  nLetterSets: 4 };


const getRandMood = () => {
  const rand = getRand(1, 3);
  return STATE.moods[rand - 1];
};

const setChatbotMood = () => {
  STATE.currentMood = getRandMood();
  for (let i = 0; i < STATE.moods.length; i++) {
    removeClass(CHAT_BOT_MOOD, STATE.moods[i]);
  }
  addClass(CHAT_BOT_MOOD, STATE.currentMood);
  CHAT_BOT_MOOD_VALUE.innerHTML = STATE.currentMood;
};

const createLetter = (cName, val) => {
  const letter = document.createElement('div');
  addClass(letter, cName);
  setAttr(letter, 'data-letter', val);
  letter.innerHTML = val;
  return letter;
};

const getAlphabet = isUpperCase => {
  let letters = [];
  for (let i = 65; i <= 90; i++) {
    let val = String.fromCharCode(i),
    letter = null;
    if (!isUpperCase) val = val.toLowerCase();
    letter = createLetter('pool-letter', val);
    letters.push(letter);
  }
  return letters;
};

const startNewLetterPath = (letter, nextRand, interval) => {
  clearInterval(interval);
  nextRand = getRandExcept(1, 4, nextRand);
  let nextPos = getRandPosOffScreen(nextRand),
  transitionPeriod = STATE.letterPool.transitionPeriod,
  delay = getRand(0, STATE.letterPool.transitionPeriod),
  transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`;
  setElPos(letter, nextPos.x, nextPos.y);
  setStyle(letter, 'transition', transition);
  interval = setInterval(() => {
    startNewLetterPath(letter, nextRand, interval);
  }, STATE.letterPool.transitionPeriod + delay);
  STATE.letterPool.intervals.push(interval);
};

const setRandLetterPaths = letters => {
  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i],
    startRand = getRand(1, 4),
    nextRand = getRandExcept(1, 4, startRand),
    startPos = getRandPosOffScreen(startRand),
    nextPos = getRandPosOffScreen(nextRand),
    transitionPeriod = STATE.letterPool.transitionPeriod,
    delay = getRand(0, STATE.letterPool.transitionPeriod) * -1,
    transition = `left ${transitionPeriod}ms linear ${delay}ms, top ${transitionPeriod}ms linear ${delay}ms, opacity 0.5s`;

    setElPos(letter, startPos.x, startPos.y);
    setStyle(letter, 'transition', transition);
    addClass(letter, 'invisible');
    LETTER_POOL.appendChild(letter);
    setTimeout(() => {
      setElPos(letter, nextPos.x, nextPos.y);
      removeClass(letter, 'invisible');
      let interval = setInterval(() => {
        startNewLetterPath(letter, nextRand, interval);
      }, STATE.letterPool.transitionPeriod + delay);
    }, 1);
  }
};

const fillLetterPool = (nSets = 1) => {
  for (let i = 0; i < nSets; i++) {
    const lCaseLetters = getAlphabet(false),
    uCaseLetters = getAlphabet(true);
    setRandLetterPaths(lCaseLetters);
    setRandLetterPaths(uCaseLetters);
  }
};

const findMissingLetters = (letters, lCount, isUpperCase) => {
  let missingLetters = [];
  for (let i = 65; i <= 90; i++) {
    let val = isUpperCase ? String.fromCharCode(i) : String.fromCharCode(i).toLowerCase(),
    nLetter = letters.filter(letter => letter === val).length;
    if (nLetter < lCount) {
      let j = nLetter;
      while (j < lCount) {
        missingLetters.push(val);
        j++;
      }
    }
  }
  return missingLetters;
};

const replenishLetterPool = (nSets = 1) => {
  const poolLetters = LETTER_POOL.childNodes;
  let charInd = 65,
  currentLetters = [],
  missingLetters = [],
  lettersToAdd = [];

  for (let i = 0; i < poolLetters.length; i++) {
    currentLetters.push(poolLetters[i].dataset.letter);
  }
  missingLetters = [...missingLetters, ...findMissingLetters(currentLetters, nSets, false)];
  missingLetters = [...missingLetters, ...findMissingLetters(currentLetters, nSets, true)];
  for (let i = 0; i < missingLetters.length; i++) {
    const val = missingLetters[i];
    lettersToAdd.push(createLetter('pool-letter', val));
  }
  setRandLetterPaths(lettersToAdd);
};

const clearLetterPool = () => {
  removeAllChildren(LETTER_POOL);
};

const scrollToBottomOfMessages = () => {
  CHAT_MESSAGE_COLUMN_WRAPPER.scrollTop = CHAT_MESSAGE_COLUMN_WRAPPER.scrollHeight;
};


const appendContentText = (contentText, text) => {
  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    letter.innerHTML = text[i];
    setAttr(letter, 'data-letter', text[i]);
    contentText.appendChild(letter);
  }
};


const findLetterInPool = targetLetter => {
  let letters = LETTER_POOL.childNodes,
  foundLetter = null;
  for (let i = 0; i < letters.length; i++) {
    const nextLetter = letters[i];
    if (nextLetter.dataset.letter === targetLetter && !nextLetter.dataset.found) {
      foundLetter = letters[i];
      setAttr(foundLetter, 'data-found', true);
      break;
    }
  }
  return foundLetter;
};

const createOverlayLetter = val => {
  const overlayLetter = document.createElement('span');
  addClass(overlayLetter, 'overlay-letter');
  addClass(overlayLetter, 'in-flight');
  overlayLetter.innerHTML = val;
  return overlayLetter;
};

const removePoolLetter = letter => {
  addClass(letter, 'invisible');
  setTimeout(() => {
    removeChild(LETTER_POOL, letter);
  }, 500);
};

const setElPosFromRight = (el, x, y) => {
  setStyle(el, 'right', x + 'px');
  setStyle(el, 'top', y + 'px');
};

const animateOverlayLetter = (letter, contentText, finalPos, isReceived) => {
  removePoolLetter(letter);
  const initPos = letter.getBoundingClientRect(),
  overlayLetter = createOverlayLetter(letter.dataset.letter);
  if (isReceived) {
    setElPos(overlayLetter, initPos.left, initPos.top);
  } else
  {
    setElPosFromRight(overlayLetter, window.innerWidth - initPos.right, initPos.top);
  }
  LETTER_OVERLAY.appendChild(overlayLetter);
  setTimeout(() => {
    if (isReceived) {
      setElPos(overlayLetter, finalPos.left, finalPos.top);
    } else
    {
      setElPosFromRight(overlayLetter, window.innerWidth - finalPos.right, finalPos.top);
    }
    setTimeout(() => {//asdf
      removeClass(contentText, 'invisible');
      addClass(overlayLetter, 'invisible');
      setTimeout(() => {
        removeChild(LETTER_OVERLAY, overlayLetter);
      }, 1000);
    }, 1500);
  }, 100);
};

const animateMessageLetters = (message, isReceived) => {
  const content = message.getElementsByClassName('content')[0],
  contentText = content.getElementsByClassName('text')[0],
  letters = contentText.childNodes,
  textPos = contentText.getBoundingClientRect();
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i],
    targetLetter = findLetterInPool(letter.dataset.letter),
    finalPos = letter.getBoundingClientRect();
    if (targetLetter) {
      animateOverlayLetter(targetLetter, contentText, finalPos, isReceived);
    } else
    {
      const tempLetter = createLetter('temp-letter', letter.dataset.letter),
      pos = getRandPosOffScreen();
      addClass(tempLetter, 'invisible');
      setElPos(tempLetter, pos.x, pos.y);
      TEMP_LETTER_POOL.appendChild(tempLetter);
      animateOverlayLetter(tempLetter, contentText, finalPos, isReceived);
      setTimeout(() => {
        removeChild(TEMP_LETTER_POOL, tempLetter);
      }, 100);
    }
  }
};


const checkIfInputFieldHasVal = () => MESSAGE_INPUT_FIELD.value.length > 0;

const clearInputField = () => {
  MESSAGE_INPUT_FIELD.value = '';
};

const disableInputField = () => {
  MESSAGE_INPUT_FIELD.blur();
  MESSAGE_INPUT_FIELD.value = '';
  MESSAGE_INPUT_FIELD.readOnly = true;
};

const enableInputField = () => {
  MESSAGE_INPUT_FIELD.readOnly = false;
  MESSAGE_INPUT_FIELD.focus();
};


const initLetterPool = () => {
  clearLetterPool();
  fillLetterPool(STATE.nLetterSets);
};

const init = () => {
  setChatbotMood();
  initLetterPool();
  sendChatbotMessage();
  toggleInput();
  setMoodInterval(getRandMoodInterval());
};

let resetTimeout = null;
const resetLetterPool = () => {
  const intervals = STATE.letterPool.intervals;
  for (let i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
  clearTimeout(resetTimeout);
  clearLetterPool();
  resetTimeout = setTimeout(() => {
    initLetterPool();
  }, 200);
};

const getRandMoodInterval = () => getRand(20000, 40000);

let moodInterval = null;
const setMoodInterval = time => {
  moodInterval = setInterval(() => {
    clearInterval(moodInterval);
    setChatbotMood();
    setMoodInterval(getRandMoodInterval());
  }, time);
};

MESSAGE_INPUT_FIELD.onkeypress = e => {
  if (checkIfInputFieldHasVal() && e.key === 'Enter') {
    removeClass(MESSAGE_INPUT, 'send-enabled');
    if (canSendMessage()) {
      onEnterPress(e);
    }
  }
};

MESSAGE_INPUT_FIELD.onkeyup = () => {
  toggleInput();
};

MESSAGE_INPUT_FIELD.oncut = () => toggleInput();

window.onload = () => init();

window.onfocus = () => resetLetterPool();

window.onresize = _.throttle(resetLetterPool, 200);