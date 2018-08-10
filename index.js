// Interpolate values for a function of the form `f(x, y) = z` within a 1x1 square (from (x, y) = (0, 0) to (1, 1)) by providing 16 points at it's edges and around it ((-1, -1), (0, -1), (1, -1), (2, -1), (0, -1), (0, 0), ..., (3, 3)).
// Takes in the 16 values for z as a 2D array and an options object. Make sure the first selector corresponds to x position (e.g. points[x][y]). This is the rotated from the visual layout if you declare the array in javascript manually. Also, keep in mind that values[0][0] actually corresponds to the value for (-1, -1).
// You can set `options.scaleX` and `options.scaleY` to multiply the positions input to the interpolator by before interpolating. defaults = 1
// You can set `options.translateX` and `options.translateY` to add to the positions input to the interpolator before interpolating (but after scaling). defaults = 0
// Returns a function that takes two arguments (x, y) and returns the interpolated value.
function createInterpolator(values, options={}) {
  options = Object.assign({
    extrapolate: false,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0
  }, options);

  //Coefficients: first number corresponds to x's exponent in the polynomial, the second to y's.
  const a00 = values[1][1],
        a01 = (-1/2)*values[1][0] + (1/2)*values[1][2],
        a02 = values[1][0] + (-5/2)*values[1][1] + 2*values[1][2] + (-1/2)*values[1][3],
        a03 = (-1/2)*values[1][0] + (3/2)*values[1][1] + (-3/2)*values[1][2] + (1/2)*values[1][3],
        a10 = (-1/2)*values[0][1] + (1/2)*values[2][1],
        a11 = (1/4)*values[0][0] + (-1/4)*values[0][2] + (-1/4)*values[2][0] + (1/4)*values[2][2],
        a12 = (-1/2)*values[0][0] + (5/4)*values[0][1] + (-1)*values[0][2] + (1/4)*values[0][3] + (1/2)*values[2][0] + (-5/4)*values[2][1] + values[2][2] + (-1/4)*values[2][3],
        a13 = (1/4)*values[0][0] + (-3/4)*values[0][1] + (3/4)*values[0][2] + (-1/4)*values[0][3] + (-1/4)*values[2][0] + (3/4)*values[2][1] + (-3/4)*values[2][2] + (1/4)*values[2][3],
        a20 = values[0][1] + (-5/2)*values[1][1] + 2*values[2][1] + (-1/2)*values[3][1],
        a21 = (-1/2)*values[0][0] + (1/2)*values[0][2] + (5/4)*values[1][0] + (-5/4)*values[1][2] + (-1)*values[2][0] + values[2][2] + (1/4)*values[3][0] + (-1/4)*values[3][2],
        a22 = values[0][0] + (-5/2)*values[0][1] + 2*values[0][2] + (-1/2)*values[0][3] + (-5/2)*values[1][0] + (25/4)*values[1][1] + (-5)*values[1][2] + (5/4)*values[1][3] + 2*values[2][0] + (-5)*values[2][1] + 4*values[2][2] + (-1)*values[2][3] + (-1/2)*values[3][0] + (5/4)*values[3][1] + (-1)*values[3][2] + (1/4)*values[3][3],
        a23 = (-1/2)*values[0][0] + (3/2)*values[0][1] + (-3/2)*values[0][2] + (1/2)*values[0][3] + (5/4)*values[1][0] + (-15/4)*values[1][1] + (15/4)*values[1][2] + (-5/4)*values[1][3] + (-1)*values[2][0] + 3*values[2][1] + (-3)*values[2][2] + values[2][3] + (1/4)*values[3][0] + (-3/4)*values[3][1] + (3/4)*values[3][2] + (-1/4)*values[3][3],
        a30 = (-1/2)*values[0][1] + (3/2)*values[1][1] + (-3/2)*values[2][1] + (1/2)*values[3][1],
        a31 = (1/4)*values[0][0] + (-1/4)*values[0][2] + (-3/4)*values[1][0] + (3/4)*values[1][2] + (3/4)*values[2][0] + (-3/4)*values[2][2] + (-1/4)*values[3][0] + (1/4)*values[3][2],
        a32 = (-1/2)*values[0][0] + (5/4)*values[0][1] + (-1)*values[0][2] + (1/4)*values[0][3] + (3/2)*values[1][0] + (-15/4)*values[1][1] + 3*values[1][2] + (-3/4)*values[1][3] + (-3/2)*values[2][0] + (15/4)*values[2][1] + (-3)*values[2][2] + (3/4)*values[2][3] + (1/2)*values[3][0] + (-5/4)*values[3][1] + values[3][2] + (-1/4)*values[3][3],
        a33 = (1/4)*values[0][0] + (-3/4)*values[0][1] + (3/4)*values[0][2] + (-1/4)*values[0][3] + (-3/4)*values[1][0] + (9/4)*values[1][1] + (-9/4)*values[1][2] + (3/4)*values[1][3] + (3/4)*values[2][0] + (-9/4)*values[2][1] + (9/4)*values[2][2] + (-3/4)*values[2][3] + (-1/4)*values[3][0] + (3/4)*values[3][1] + (-3/4)*values[3][2] + (1/4)*values[3][3];

  return (x, y) => {
    x = (x * options.scaleX) + options.translateX;
    y = (y * options.scaleY) + options.translateY;

    if(x < 0 || y < 0 || x > 1 || y > 1) throw 'cannot interpolate outside the square from (0, 0) to (1, 1): (' + x + ', ' + y + ')';

    const x2 = x*x,
          x3 = x*x2,
          y2 = y*y,
          y3 = y*y2;

    return (a00 + a01*y + a02*y2 + a03*y3) +
           (a10 + a11*y + a12*y2 + a13*y3) * x +
           (a20 + a21*y + a22*y2 + a23*y3) * x2 +
           (a30 + a31*y + a32*y2 + a33*y3) * x3;
  }
}

// Interpolate values for a function of the form `f(x, y) = z` within an (m-3)x(n-3) rectangle (from (x, y) = (1, 1) to (m-2, n-2)) by providing m x n samples for z.
// Takes in the m x n values for z as a 2D array and an options object. If `options.extrapolate` is true, this will get modified. Make sure the first selector corresponds to x position (e.g. points[x][y]). This is the rotated from the visual layout if you declare the array in javascript manually. Also, keep in mind that for this function, values[0][0] actually does corresponds to the value for (0, 0).
// If `options.extrapolate` is true, the `values` arrays will be modified to allow for interpolating from (-1, -1) to (m, n) by linearly estimating a margin of 2 more values on each side. This is useful, for example, to interpolate values of an image all the way to the edge of the pixels on the edge (corresponding to -0.5 < x < m-0.5 and -0.5 < y < n-0.5). default = false
// You can set `options.scaleX` and `options.scaleY` to multiply the positions input to the interpolators by before interpolating. defaults = 1
// You can set `options.translateX` and `options.translateY` to add to the positions input to the interpolators before interpolating (but after scaling). defaults = 0
// Returns a function that takes two arguments (x, y) and returns the interpolated value.
function createGridInterpolator(values, options={}) {
  options = Object.assign({
    extrapolate: false,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0
  }, options);

  const m = values.length;
  const n = values[0].length;
  const interpolators = [];

  if(options.extrapolate) {
    //Extrapolate X
    values[-2] = [];
    values[-1] = [];
    values[m] = [];
    values[m+1] = [];
    for(var y = 0; y < n; y++) {
      const leftDelta = values[0][y] -  values[1][y];
      const rightDelta = values[m-1][y] - values[m-2][y];
      values[-2][y] = values[0][y] + 2*leftDelta;
      values[-1][y] = values[0][y] + leftDelta;
      values[m][y] = values[m-1][y] + rightDelta;
      values[m+1][y] = values[m-1][y] + 2*rightDelta;
    }

    //Extrapolate Y
    for(var x = -2; x < m+2; x++) {
      const bottomDelta = values[x][0] - values[x][1];
      const topDelta = values[x][n-1] - values[x][n-2];
      values[x][-2] = values[x][0] + 2*bottomDelta;
      values[x][-1] = values[x][0] + bottomDelta;
      values[x][n] = values[x][n-1] + topDelta;
      values[x][n+1] = values[x][n-1] + 2*topDelta;
    }

    //Populate interpolator arrays
    for(var x = -1; x < m; x++) interpolators[x] = [];
  }else {
    //Populate interpolator arrays
    for(var x = 1; x < m-2; x++) interpolators[x] = [];
  }

  return (x, y) => {
    x = (x * options.scaleX) + options.translateX;
    y = (y * options.scaleY) + options.translateY;

    if(options.extrapolate) {
      if(x < -1 || y < -1 || x > m || y > n) throw 'cannot interpolate outside the rectangle from (-1, -1) to (' + m + ', ' + n + ') even when extrapolating: (' + x + ', ' + y + ')';
    }else {
      if(x < 1 || y < 1 || x > m-2 || y > n-2) throw 'cannot interpolate outside the rectangle from (1, 1) to (' + (m-2) + ', ' + (n-2) + '): (' + x + ', ' + y + '), you might want to enable extrapolating';
    }

    var blX = Math.floor(x);// The position of interpolator's (0, 0) for this point
    var blY = Math.floor(y);

    if(options.extrapolate) {//If you're trying to interpolate on the top or right edges of what can be interpolated, you have to interpolate in the region to the left or bottom respectively.
      if(x === m) blX--;
      if(y === n) blY--;
    }else {
      if(x === m-2) blX--;
      if(y === n-2) blY--;
    }


    if(!interpolators[blX][blY]) {
      interpolators[blX][blY] = createInterpolator([
        [values[blX-1][blY-1], values[blX-1][blY], values[blX-1][blY+1], values[blX-1][blY+2]],
        [values[blX+0][blY-1], values[blX+0][blY], values[blX][blY+1], values[blX][blY+2]],
        [values[blX+1][blY-1], values[blX+1][blY], values[blX+1][blY+1], values[blX+1][blY+2]],
        [values[blX+2][blY-1], values[blX+2][blY], values[blX+2][blY+1], values[blX+2][blY+2]]
      ], {
        translateX: -blX,
        translateY: -blY
      });
    }
    const interpolator = interpolators[blX][blY];
    
    return interpolator(x, y);
  }
}

// These are just helper functions for when you need to interpolate multiple sets of values (e.g. components of color in an image).
// Instead of taking in 2D value arrays they expect 3D arrays, where the last index corresponds to the set/ surface (e.g. values[x][y][s])
function createMultiInterpolator(values, options={}) {
  const s = values[0][0].length;
  const interpolators = [];
  for(var i = 0; i < s; i++) interpolators[i] = createInterpolator(values.map(col => col.map(vals => vals[i])), options);
  return (x, y) => {
    return interpolators.map(interpolator => interpolator(x, y));
  }
}

function createMultiGridInterpolator(values, options={}) {
  const s = values[0][0].length;
  const interpolators = [];
  for(var i = 0; i < s; i++) interpolators[i] = createGridInterpolator(values.map(col => col.map(vals => vals[i])), options);
  return (x, y) => {
    return interpolators.map(interpolator => interpolator(x, y));
  }
}

module.exports = {
  createInterpolator: createInterpolator,
  createGridInterpolator: createGridInterpolator,
  createMultiInterpolator: createMultiInterpolator,
  createMultiGridInterpolator: createMultiGridInterpolator
};
