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

const serviceKeys = [
  'Tab', 'CapsLock', 'ShiftLeft', 'ShiftRight', 'Ctrl', 'Fn',
  'Win', 'Alt', 'Space', 'Menu', 'Enter', 'Backspace',
];

const langs = {
  'english': true,
  'russian': false,
};

let currentLang = 'english';
let isCapslockPress = false;
let isShiftPress = false;

let keyboardKeys;

const changeLang = function (evt) {
  for (let lang in langs) {
    langs[lang] === true ? langs[lang] = false : langs[lang] = true;
  }

  for (let lang in langs) {
    if (langs[lang] === true) currentLang = lang;
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
      console.log('combo')
      pressed = [];
      func();
    }
  });

  document.addEventListener('keyup', function (evt) {
    pressed = [];
  });
};

window.addEventListener('load', function () {
  const textarea = createTextarea();
  document.body.appendChild(textarea);

  renderKeyboard(currentLang);

  runsOnKeys(changeLang, ['Shift', 'Alt']);

  document.addEventListener('keydown', function (evt) {
    console.log(evt);
    onCapsLockKeydown(evt);
    onShiftKeydown(evt);

    addLightButton(evt, keyboardKeys);
  });

  document.addEventListener('keyup', function (evt) {
    onShiftKeyup(evt);

    removeLightButton(evt, keyboardKeys);
  });
});

const addLightButton = function (evt, keys) {
  let currentKey = evt.key;
  let currentButton;

  keys.forEach(key => {
    let buttonValue = key.textContent;

    if (currentKey.toLowerCase() === buttonValue.toLowerCase()) {
      currentButton = key;
    }
  })

  currentButton.classList.add('keyboard__key--active');
};

const removeLightButton = function (evt, keys) {
  let currentKey = evt.key;
  let currentButton;

  keys.forEach(key => {
    let buttonValue = key.textContent;

    if (currentKey.toLowerCase() === buttonValue.toLowerCase()) {
      currentButton = key;
    }
  })

  currentButton.classList.remove('keyboard__key--active');
};

const onCapsLockKeydown = function (evt) {
  if (evt.key === 'CapsLock') {
    isCapslockPress === true ? isCapslockPress = false : isCapslockPress = true;
    renderKeyboard(currentLang)
    console.log('CapsLock press');
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

  layout.forEach(value => {
    let button = createButton(value);
    keysFragment.append(button);

    if (value === 'Backspace' ||
        value === '\\' ||
        value === '|' ||
        value === 'Enter' ||
        value === 'ShiftRight' ||
        (value === '/' && currentLang === 'russian')
    ) {
      const br = document.createElement('br');
      keysFragment.appendChild(br);
    }
  })

  keyboard.append(keysFragment);

  return keyboard;
};

const createButton = function (value) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.textContent = value;

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

  if (isCapslockPress && !serviceKeys.includes(value)) {
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

  keyboardKeys = document.querySelectorAll('.keyboard__key');
}
