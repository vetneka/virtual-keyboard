'use strict';

const layout = {
  'english': {
    'default': [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
      'ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl', '←', '↑', '↓', '→',
    ],

    'shift': [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace',
      'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
      'CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter',
      'ShiftLeft', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'ShiftRight',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl', '←', '↑', '↓', '→',
    ],
  },

  'russian': {
    'default': [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
      'ShiftLeft', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'ShiftRight',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl', '←', '↑', '↓', '→',
    ],

    'shift': [
      'Ё', '!', '"', '№', '$;', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace',
      'Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
      'CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Enter',
      'ShiftLeft', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'ShiftRight',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl', '←', '↑', '↓', '→',
    ],
  }
};

const layoutKeysCode = [
  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',
  'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
  'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight',
  'ControlLeft', 'Fn', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ContextMenu', 'ControlRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight',
];

const serviceKeys = {
  'Tab': '\t',
  'Space': ' ',
  'Enter': '\n',
  'CapsLock': '',
  'ControlLeft': '',
  'Fn': '',
  'MetaLeft': '',
  'ShiftLeft': '',
  'AltLeft': '',
  'AltRight': '',
  'ContextMenu': '',
  'ControlRight': '',
  'ShiftRight': '',
  'Backspace': function (textarea) {
    let textareaContent = textarea.textContent;
    textarea.textContent = textareaContent.substring(0, textareaContent.length - 1);
  },
};

const langs = {
  'english': true,
  'russian': false,
};

let myStorage = window.localStorage;

let currentLang = 'english';
let isCapslockPress = false;
let isShiftPress = false;

let keyboardButtons;

const onChangeLang = function () {
  for (let lang in langs) {
    langs[lang] === true ? langs[lang] = false : langs[lang] = true;
  }

  for (let lang in langs) {
    if (langs[lang] === true) {
      currentLang = lang;
      myStorage.setItem('currentLang', currentLang);
    }
  }

  renderKeyboard(currentLang);
};

const runsOnKeys = function (func, keys) {
  let pressed = [];

  document.addEventListener('keydown', function (evt) {
    let pressedKey = evt.key;

    if (!pressed.includes(pressedKey)) {
      pressed.push(pressedKey);
    }

    let isTrueKombo = keys.every(key => {
      return pressed.includes(key);
    });

    if (isTrueKombo) {
      pressed = [];
      func();
    }
  });

  document.addEventListener('keyup', function (evt) {
    pressed = [];
  });
};

window.addEventListener('load', function () {
  if (localStorage.getItem('currentLang')) {
    currentLang = localStorage.getItem('currentLang');
  }

  const textarea = createTextarea();
  document.body.appendChild(textarea);

  renderKeyboard(currentLang);

  document.addEventListener('mousedown', function (evt) {
    if (layoutKeysCode.includes(evt.target.dataset.code)) {
      onCapsLockKeydown(evt);

      onClickKeyboardButton(evt);
      writeOnTextarea();
    }
  });

  document.addEventListener('mouseup', function (evt) {
    if (layoutKeysCode.includes(evt.target.dataset.code)) {
      onClickKeyboardButton(evt, false);
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (layoutKeysCode.includes(evt.code)) {
      evt.preventDefault();

      onCapsLockKeydown(evt);
      onShiftKeydown(evt);

      changeLightButton(evt, keyboardButtons);
      writeOnTextarea();
    }
  });

  document.addEventListener('keyup', function (evt) {
    if (layoutKeysCode.includes(evt.code)) {
      onShiftKeyup(evt);

      changeLightButton(evt, keyboardButtons, false);
    }
  });

  runsOnKeys(onChangeLang, ['Shift', 'Alt']);
});

const writeOnTextarea = function () {
  let textarea = document.querySelector('.textarea');
  let currentButton = document.querySelector('.keyboard__key--active');

  if (serviceKeys.hasOwnProperty(currentButton.dataset.code)) {
    let currentButtonCode = currentButton.dataset.code;
    if (currentButtonCode === 'Backspace') {
      let onBackspace = serviceKeys[currentButtonCode];
      onBackspace(textarea);
    } else {
      textarea.textContent += serviceKeys[currentButton.dataset.code];
    }
  } else {
    textarea.textContent += currentButton.textContent;
  }
};

const changeLightButton = function (evt, buttons, isAddLight = true) {
  let currentButton;

  buttons.forEach(button => {
    if (evt.code === button.dataset.code) {
      currentButton = button;
    }
  })

  if (isAddLight) {
    currentButton.classList.add('keyboard__key--active');
  } else {
    currentButton.classList.remove('keyboard__key--active');
  }
};

const onClickKeyboardButton = function (evt, isAddLight = true) {
  let currentButton = evt.target;

  if (!currentButton.classList.contains('keyboard__key')) return;

  if (isAddLight) {
    currentButton.classList.add('keyboard__key--active');
  } else {
    currentButton.classList.remove('keyboard__key--active');
  }
};

const onCapsLockKeydown = function (evt) {
  if (evt.key === 'CapsLock' || evt.target.dataset.code === 'CapsLock') {
    if (isCapslockPress === true) {
      isCapslockPress = false
    } else {
      isCapslockPress = true;
    }

    renderKeyboard(currentLang);
  }
};

const onShiftKeydown = function (evt) {
  if (evt.key === 'Shift') {
    isShiftPress = true;
    renderKeyboard(currentLang);
    isShiftPress = false;
  }
};

const onShiftKeyup = function (evt) {
  if (evt.key === 'Shift') {
    renderKeyboard(currentLang);
  }
};

const createTextarea = function () {
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');

  return textarea;
};

const createKeyboard = function (layout) {
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');

  let keysFragment = document.createDocumentFragment();

  layout.forEach((value, index) => {
    let button = createButton(value, layoutKeysCode[index]);
    keysFragment.append(button);

    if (button.dataset.code === 'Backspace' ||
        button.dataset.code === 'Backslash' ||
        button.dataset.code === 'Enter' ||
        button.dataset.code === 'ShiftRight'
    ) {
      const br = document.createElement('br');
      keysFragment.appendChild(br);
    }
  })

  keyboard.append(keysFragment);

  return keyboard;
};

const createButton = function (value, code) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.textContent = value;
  button.dataset.code = code;

  button.classList.add('keyboard__key');

  switch (value) {
    case 'Space':
      button.classList.add('keyboard__key--size-7');
      break;

    case 'ShiftLeft':
    case 'ShiftRight':
      button.classList.add('keyboard__key--size-6');
      break;

    case 'CapsLock':
    case 'Backspace':
      button.classList.add('keyboard__key--size-5');
      break;

    case 'Enter':
      button.classList.add('keyboard__key--size-4');
      break;

    case 'Tab':
      button.classList.add('keyboard__key--size-3');
      break;

    case 'Ctrl':
      button.classList.add('keyboard__key--size-2');
      break;

    default:
      break;
  }

  if (isCapslockPress && !serviceKeys.hasOwnProperty(code)) {
    button.textContent = value.toUpperCase();
  }

  return button;
};

const renderKeyboard = function (lang) {
  const oldKeyboard = document.querySelector('.keyboard');

  if (oldKeyboard) {
    oldKeyboard.remove();
  }

  let keyboard;

  if (isShiftPress) {
    keyboard = createKeyboard(layout[lang].shift);
  } else {
    keyboard = createKeyboard(layout[lang].default);
  }

  document.body.appendChild(keyboard);

  keyboardButtons = document.querySelectorAll('.keyboard__key');
}
