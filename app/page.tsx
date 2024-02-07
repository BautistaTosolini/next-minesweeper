import Board from '@/app/components/Board';
import ResetButton from '@/app/components/ResetButton';
import { BOMBS_COUNT, CELL_BORDERS, GRID_SIZE } from '@/app/constants';

const generateMatrix = () => {
  const MATRIX = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0 as string | number));
  const bombCells: string[] = [];

  // generate random bombs in the board
  for (let count = BOMBS_COUNT; count > 0; count--) {
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

        // check the 9 surrounding cells
        for (const border of CELL_BORDERS) {
          if (MATRIX[i + border[0]]?.[j + border[1]] === 'X') {
            bombsCount++;
          }
        }

        MATRIX[i][j] = bombsCount;
      }
    }
  }

  return MATRIX;
}


export default function Home() {
  const MATRIX = generateMatrix();

  return (
    <main className='flex flex-col items-center gap-4 pb-4'>
      <Board matrix={MATRIX} />
      <ResetButton />
    </main>
  );
}
