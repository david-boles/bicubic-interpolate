const bicubic = require('./');

console.log('individual interpolator')
const interpolator = bicubic.createInterpolator([
  [1, 2, 4, 8],//y=-1
  [2, 4, 8, 16],//y=0
  [3, 6, 12, 24],//y=1
  [4, 8, 16, 32]//y=2
]);
console.log('@(0, 0)', interpolator(0, 0));//Notice that this is [1][1] in the array, not [0][0]
console.log('@(1, 0)', interpolator(1, 0));//Notice that this is the 3rd row, not the 3rd column, although (x, y) corresponds to [x, y]
console.log('@(0, 1)', interpolator(0, 1));//Notice that this is the 3rd column, not the 3rd row
console.log('@(1, 1)', interpolator(1, 1));
console.log('@(0.5, 0.5)', interpolator(0.5, 0.5));//Woo! Interpolated!
console.log('@(pi/4, e/3)', interpolator(Math.PI/4, Math.E/3));//And at any point you want, but keep both x and y within the 0-1 range for the interpolation to really make any sense.