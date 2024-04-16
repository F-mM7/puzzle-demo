function clearChildren(elm) {
  while (elm.firstChild) elm.removeChild(elm.firstChild);
}

function ran(n) {
  return Math.floor(Math.random() * n);
}

function giveCorrectClass(elm, b) {
  elm.classList.remove("correct", "incorrect");
  elm.offsetWidth;
  elm.classList.add(b ? "correct" : "incorrect");
}
