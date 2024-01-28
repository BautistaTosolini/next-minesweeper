import Board from "@/app/components/Board";

const GRID_SIZE = 10;
const MATRIX = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0 as string | number));
const CELL_BORDERS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const bombCells: string[] = [];

// generate random bombs in the board
for (let count = GRID_SIZE; count > 0; count--) {
  let randomRow = Math.floor(Math.random() * GRID_SIZE);
  let randomCell = Math.floor(Math.random() * GRID_SIZE);

  // if the random cell picked already has a bomb, pick another one
  while (bombCells.includes(`${randomRow}-${randomCell}`)) {
    randomRow = Math.floor(Math.random() * GRID_SIZE);
    randomCell = Math.floor(Math.random() * GRID_SIZE);
  }

  MATRIX[randomRow][randomCell] = 'X';
  bombCells.push(`${randomRow}-${randomCell}`);
}

// place the number of bombs close to each cell
for (let i = 0; i < MATRIX.length; i++) {
  for (let j = 0; j < MATRIX[i].length; j++) {
    if (MATRIX[i][j] !== 'X') {
      let bombsCount = 0;
  
      // check the surrounding 9 cells
      for (const border of CELL_BORDERS) {
        if (MATRIX[i + border[0]]?.[j + border[1]] === 'X') {
          bombsCount++;
        }
      }
  
      MATRIX[i][j] = bombsCount;
    }
  }
}

export default function Home() {
  return (
    <main>
      <Board matrix={MATRIX} />
    </main>
  );
}
