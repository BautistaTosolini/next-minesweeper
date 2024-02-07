export const BOMBS_COUNT: number = 15;
export const GRID_SIZE: number = 10;
// by adding this coordinates to the coordinates of the cell, you can get the 9 cells surrounding the initial one
export const CELL_BORDERS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]