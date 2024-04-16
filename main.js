const H = 5;
const W = 8;
let unit;
function floor_unit(x, b = 0, a = unit) {
  return Math.floor((x - b) / a) * a + b;
}
function round_unit(x, b = 0, a = unit) {
  return Math.round((x - b) / a) * a + b;
}

const res = 48;

const pieces = [];

const tet_i = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
];
const tet_o = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
const tet_t = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 1],
];
const tet_j = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, -1],
];
const tet_l = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
];
const tet_s = [
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
];

const tet_z = [
  [0, 0],
  [0, -1],
  [1, 1],
  [1, 0],
];

const tetrominos = [
  tet_i,
  tet_i,
  tet_o,
  tet_o,
  tet_t,
  tet_t,
  tet_j,
  tet_l,
  tet_s,
  tet_z,
];

const colors = [
  "aqua",
  "aqua",
  "yellow",
  "yellow",
  "fuchsia",
  "fuchsia",
  "blue",
  "orange",
  "lime",
  "red",
];

function form(cvs, v) {
  const cvs_jq = $(cvs);
  cvs_jq.attr("v", v);

  let x_min = v[0][0];
  let x_max = v[0][0];
  let y_min = v[0][1];
  let y_max = v[0][1];
  for ([x, y] of v) {
    x_min = Math.min(x_min, x);
    x_max = Math.max(x_max, x);
    y_min = Math.min(y_min, y);
    y_max = Math.max(y_max, y);
  }

  cvs_jq.css({
    height: unit * (x_max - x_min + 1),
    width: unit * (y_max - y_min + 1),
  });

  cvs_jq[0].height = res * (x_max - x_min + 1);
  cvs_jq[0].width = res * (y_max - y_min + 1);

  const ctx = cvs_jq[0].getContext("2d");
  ctx.fillStyle = cvs_jq.attr("color");

  for ([x, y] of v) {
    ctx.strokeRect((y - y_min) * res, (x - x_min) * res, res, res);
    ctx.fillRect((y - y_min) * res, (x - x_min) * res, res, res);
  }
}

const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

function rot_r(r, cx = 0, cy = 0) {
  const x = r[0];
  const y = r[1];
  const nx = y - cy + cx;
  const ny = -(x - cx) + cy;
  return [nx, ny];
}

function get_v(cvs_jq) {
  const v_arr = cvs_jq
    .attr("v")
    .split(",")
    .map((e) => parseInt(e));
  const n = v_arr.length;
  const v = [];
  for (let i = 0; i < n; i += 2) v.push([v_arr[i], v_arr[i + 1]]);
  return v;
}

function rot(cvs) {
  const cvs_jq = $(cvs);
  const v = get_v(cvs_jq);

  const cx = v[0][0];
  const cy = v[0][1];
  for (i in v) v[i] = rot_r(v[i], cx, cy);

  form(cvs, v);
}

function add_piece(v = [[0, 0]], color = "white") {
  const cvs_jq = $("<canvas>", {
    class: "piece",
  })
    .appendTo("#field")
    .draggable({
      scroll: false,
      containment: "#field",
      stop: function (e, o) {
        let a = o.position;
        const b = $("#board").offset();
        a.left = round_unit(a.left, b.left);
        a.top = round_unit(a.top, b.top);
        $(e.target).offset(a);
      },
    })
    .on("click", function () {
      rot(cvs_jq[0]);
    })
    .attr("color", color);

  pieces.push(cvs_jq[0]);

  form(cvs_jq[0], v);
}

window.onload = function () {
  unit = Math.floor(
    Math.min(
      Math.sqrt(($(window).height() * $(window).width()) / H / W / 4),
      $(window).height() / (H + 2),
      $(window).width() / (W + 2)
    )
  );

  $("#field").css({
    height: floor_unit($(window).height() / unit, H, 2) * unit,
    width: floor_unit($(window).width() / unit, W, 2) * unit,
  });
  $("#board").css({ height: unit * H, width: unit * W });

  for (i in tetrominos) add_piece(tetrominos[i], colors[i]);
};