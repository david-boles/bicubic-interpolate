const bicubic = require('./');

//INDIVIDUAL
console.log('individual interpolator');

const interpolator = bicubic.createInterpolator([
  [1, 2, 4, 8],//x=-1
  [2, 4, 8, 16],//x=0
  [3, 6, 12, 24],//x=1
  [4, 8, 16, 32]//x=2
]);
console.log('@(0, 0)', interpolator(0, 0));//Notice that this is [1][1] in the array, not [0][0]
console.log('@(1, 0)', interpolator(1, 0));//Notice that this is the 3rd row, not the 3rd column, although (x, y) corresponds to [x, y]
console.log('@(0, 1)', interpolator(0, 1));//Notice that this is the 3rd column, not the 3rd row
console.log('@(1, 1)', interpolator(1, 1));
console.log('@(0.5, 0.5)', interpolator(0.5, 0.5));//Woo! Interpolated!
console.log('@(pi/4, e/3)', interpolator(Math.PI/4, Math.E/3));//And you can interpolate at any point you want.

//Keep both x and y within the 0-1 range or an error will be thrown.
try {
  interpolator(-0.1, 2);//But keep both x and y within the 0-1 range or an error will be thrown.
}catch(e) {
  console.warn(e);
}

//You can also do some basic transforms to convert points into 'interpolator space' if you're using a different coordinate system.
const transformingInterpolator = bicubic.createInterpolator([
  [1, 2, 4, 8],//x=-1
  [2, 4, 8, 16],//x=0
  [3, 6, 12, 24],//x=1
  [4, 8, 16, 32]//x=2
], {
  scaleX: 0.5,
  scaleY: 1/3,
  translateX: -4,
  translateY: 0.2
});
console.log('@(8, 2.4) (transforming)', transformingInterpolator( (1 - (-4))/0.5, (1 - 0.2)/(1/3) ));//The coordinate system is transformed such that (8, 2.4) corresponds to the untransformed (1, 1)



//GRID
console.log('\ngrid interpolator');

const gridInterpolator = bicubic.createGridInterpolator([
  [1, 2, 4, 8, 16],//x=0
  [2, 4, 8, 16, 32],//x=1
  [3, 6, 12, 24, 48],//x=2
  [4, 8, 16, 32, 64],//x=3
  [5, 10, 20, 40, 80],//x=4
  [6, 12, 24, 48, 96],//x=5
]);
console.log('@(1, 1)', gridInterpolator(1, 1));//Notice that this is actually [1][1] in the array, unlike for the individual interpolator (where it would be [2][2])
console.log('@(1.5, 1.5)', gridInterpolator(1.5, 1.5));//Woo! Interpolated!
console.log('@(2.2, 2.7)', gridInterpolator(4, 2.7));//New individual interpolators are automatically created

//Make sure 1 <= x <= m-2 and 1 <= y <= n-2
try {
  gridInterpolator(0.9, 3.1);
}catch(e) {
  console.warn(e);
}

//Unless you enable extrapolating, in which case you can go out as far as -1 and m/n
console.log('extrapolated interpolating',
  bicubic.createGridInterpolator([
    [1, 2, 4, 8, 16],//x=0
    [2, 4, 8, 16, 32],//x=1
    [3, 6, 12, 24, 48],//x=2
    [4, 8, 16, 32, 64],//x=3
    [5, 10, 20, 40, 80],//x=4
    [6, 12, 24, 48, 96],//x=5
  ], {extrapolate: true})(6, 5)
);

//Grid interpolators can transform your points before interpolating just like individual interpolators:
const transformingGridInterpolator = bicubic.createGridInterpolator([
  [1, 2, 4, 8, 16],//x=0
  [2, 4, 8, 16, 32],//x=1
  [3, 6, 12, 24, 48],//x=2
  [4, 8, 16, 32, 64],//x=3
  [5, 10, 20, 40, 80]//x=4
], {
  scaleX: 0.5,
  scaleY: 1/3,
  translateX: -4,
  translateY: 0.2
});
console.log('@(8, 2.4) (transforming grid)', transformingGridInterpolator( (1 - (-4))/0.5, (1 - 0.2)/(1/3) ));//The coordinate system is transformed such that (8, 2.4) corresponds to the untransformed (1, 1)

//Grid interpolators cache the individual interpolators they use
var start = new Date();
const newGridInterpolator = bicubic.createGridInterpolator([
  [1, 2, 4, 8],//x=0
  [2, 4, 8, 16],//x=1
  [3, 6, 12, 24],//x=2
  [4, 8, 16, 32],//x=3
]);
for(var i = 0; i < 1000000; i++) {
  newGridInterpolator(1.5, 1.5);
}
console.log('grid interpolate 1 million times:', (new Date()) - start + 'ms');

start = new Date();
for(var i = 0; i < 1000000; i++) {
  const newInterpolator = bicubic.createInterpolator([
    [1, 2, 4, 8],//x=-1
    [2, 4, 8, 16],//x=0
    [3, 6, 12, 24],//x=1
    [4, 8, 16, 32]//x=2
  ]);
  newInterpolator(0.5, 0.5);
}
console.log('uncached interpolate 1 million times:', (new Date()) - start + 'ms');



//MULTI
console.log('\nmulti interpolators')

//Interpolate multiple surfaces at once
const multiInterpolator = bicubic.createMultiInterpolator([
  [[1, 32], [2, 24],  [4, 16],  [8, 8]],//x=-1
  [[2, 16], [4, 12],  [8, 8],   [16, 4]],//x=0
  [[3, 8],  [6, 6],   [12, 4],  [24, 2]],//x=1
  [[4, 4],  [8, 3],   [16, 2],  [32, 1]]//x=2
]);
console.log('@(0, 0)', multiInterpolator(0, 0));
console.log('@(1, 1)', multiInterpolator(1, 1));
console.log('@(pi/4, e/3)', multiInterpolator(Math.PI/4, Math.E/3));
