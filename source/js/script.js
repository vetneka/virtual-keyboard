'use strict';

const layout = {
  'english': {
    'default': [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter',
      'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'Shift',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', '←', '↓', '→', 'Ctrl',
    ],

    'shift': [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace',
      'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
      'CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter',
      'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '↑', 'Shift',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', '←', '↓', '→', 'Ctrl',
    ],
  },

  'russian': {
    'default': [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
      'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
      'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '↑', 'Shift',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', '←', '↓', '→', 'Ctrl',
    ],

    'shift': [
      'Ё', '!', '"', '№', '$;', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace',
      'Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
      'CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Enter',
      'Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', '↑', 'Shift',
      'Ctrl', 'Fn', 'Win', 'Alt', 'Space', 'Alt', 'Menu', '←', '↓', '→', 'Ctrl',
    ],
  }
};

const layoutKeysCode = [
  'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
  'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',
  'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
  'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight',
  'ControlLeft', 'Fn', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ContextMenu', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight',
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

window.addEventListener('load', function () {
  setInfo();

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
      writeOnTextarea(evt.target.dataset.code);
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (layoutKeysCode.includes(evt.code)) {
      evt.preventDefault();

      onCapsLockKeydown(evt);
      onShiftKeydown(evt);

      onPressKeyboardButton(evt, keyboardButtons);
      writeOnTextarea(evt.code);
    }
  });

  document.addEventListener('keyup', function (evt) {
    if (layoutKeysCode.includes(evt.code)) {
      onShiftKeyup(evt);
      onPressKeyboardButton(evt, keyboardButtons, false);
    }
  });

  runsOnKeys(onChangeLang, ['Shift', 'Alt']);
});

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

const writeOnTextarea = function (buttonCode) {
  let textarea = document.querySelector('.textarea');
  let currentButton = document.querySelector(`button[data-code="${buttonCode}"]`);

  if (serviceKeys.hasOwnProperty(currentButton.dataset.code)) {
    let currentButtonCode = currentButton.dataset.code;

    if (currentButtonCode === 'Backspace') {
      let onBackspace = serviceKeys[currentButtonCode];
      onBackspace(textarea);
    } else {
      textarea.textContent += serviceKeys[currentButtonCode];
    }

  } else {
    textarea.textContent += currentButton.textContent;
  }
};

const onPressKeyboardButton = function (evt, buttons, isAddLight = true) {
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

    if (evt.code === 'CapsLock' && isCapslockPress) {
      currentButton.classList.add('keyboard__key--active');
    }
  }
};

const onClickKeyboardButton = function (evt) {
  let currentButton = evt.target;
  console.log(currentButton)

  if (!currentButton.classList.contains('keyboard__key')) return;

  currentButton.classList.add('keyboard__key--active');

  currentButton.addEventListener('mouseout', function () {
    currentButton.classList.remove('keyboard__key--active');
  });
};

const onCapsLockKeydown = function (evt) {
  if (evt.key === 'CapsLock' || evt.target.dataset.code === 'CapsLock') {
    if (isCapslockPress === true) {
      isCapslockPress = false;
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

  switch (code) {
    case 'Space':
      button.classList.add('keyboard__key--space');
      break;

    case 'ShiftLeft':
      button.classList.add('keyboard__key--shift');
      break;

    case 'ShiftRight':
      button.classList.add('keyboard__key--shift-right');
      break;

    case 'CapsLock':
      button.classList.add('keyboard__key--capslock');
      break;

    case 'Backspace':
      button.classList.add('keyboard__key--backspace');
      break;

    case 'Backslash':
      button.classList.add('keyboard__key--backslash');
      break;

    case 'Enter':
      button.classList.add('keyboard__key--enter');
      break;

    case 'Tab':
      button.classList.add('keyboard__key--tab');
      break;

    case 'Ctrl':
      button.classList.add('keyboard__key--ctrl');
      break;

    default:
      break;
  }

  if (isCapslockPress && !serviceKeys.hasOwnProperty(code)) {
    button.textContent = value.toUpperCase();
  }

  if (isCapslockPress && code === 'CapsLock') {
    button.classList.add('keyboard__key--active');
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

const setInfo = function () {
  let title = document.createElement('h1');
  title.classList.add('info__title');
  title.textContent = 'RSS Virtual Keyboard';

  let info = document.createElement('p');
  info.classList.add('info__description');
  info.textContent = 'Клавиатура создана в операционной системе Windows. Для переключения языка комбинация: левыe Shift + Alt';
  document.body.append(title, info);
};
