'use client'

import { useEffect, useState } from 'react';
import Cell from '@/app/components/Cell';
import { BOMBS_COUNT, GRID_SIZE } from '@/app/page';
import { FlagIcon } from 'lucide-react';

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

const Board = ({ matrix }: { matrix: (string | number)[][] }) => {
  const [clicked, setClicked] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [flags, setFlags] = useState(BOMBS_COUNT)
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'lost' | 'won'>('idle');

  useEffect(() => {
    if (status === 'idle') {
      clearInterval(intervalId!);
      setTime(0);
    } else if (status === 'playing' && !intervalId) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    } else if (status === 'lost' || status === 'won') {
      clearInterval(intervalId!);
    }
  }, [status, intervalId]);

  // converts the time in minutes:seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return formattedTime;
  };

  // clear the entire board when losing
  const clearBoard = () => {
    const allCells = matrix.flatMap((row, rowIndex) =>
      row.map((cell, cellIndex) => `${rowIndex}-${cellIndex}`)
    );
    setClicked(allCells);
  };

  // if the user clicks in an empty cell, all the adyacent cells will clear until it meets a number
  const clearSurroundings = (rowIndex: number, cellIndex: number, visitedCells: Set<string>) => {
    const key = `${rowIndex}-${cellIndex}`;
    
    // checking the cell isn't outside the grid
    if (visitedCells.has(key) || rowIndex === -1 || rowIndex === 11 || cellIndex === -1 || cellIndex === 11) {
      return;
    }

    // checking the cell isn't flagged
    if (flagged.includes(`${rowIndex}-${cellIndex}`)) {
      return;
    }

    visitedCells.add(key);

    // getting the value of the cell
    const cellValue = matrix[rowIndex]?.[cellIndex] as number;

    if (cellValue > 0 || cellValue === 0) {
      setClicked((clicked) => clicked.concat(key));
    }

    // if the cell its empty recall the function 9 times (one per cell surrounding)
    if (cellValue === 0) {
      for (const border of CELL_BORDERS) {
        clearSurroundings(rowIndex + border[0], cellIndex + border[1], visitedCells);
      }
    }
  }

  const handleLeftClick = (rowIndex: number, cellIndex: number) => {
    if (status === 'idle') setStatus('playing');

    if (matrix[rowIndex][cellIndex] === 0) {
      // if the user clicks in an empty cell, all the adyacent cells will clear until it meets a number
      const visitedCells = new Set<string>();
      clearSurroundings(rowIndex, cellIndex, visitedCells);
    } 
    else if (matrix[rowIndex][cellIndex] === 'X') {
      console.log('CLICKED BOMB')
      setStatus('lost');
      setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
      clearBoard();
      return;
    }
    if (clicked.length === (GRID_SIZE * GRID_SIZE) - BOMBS_COUNT) {
      setStatus('won');
    }

    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
  }

  const handleRightClick = (rowIndex: number, cellIndex: number) => {
    if (status === 'idle' || status === 'won') return;

    if (!flagged.includes(`${rowIndex}-${cellIndex}`) && flags > 0) {
      // adding the flag
      setFlagged((flagged) => flagged.concat(`${rowIndex}-${cellIndex}`));
      setFlags(flags - 1);
    } 
    else if (flagged.includes(`${rowIndex}-${cellIndex}`)) {
      // removing the flag
      setFlagged((flagged) => flagged.filter(cell => cell !== `${rowIndex}-${cellIndex}`));
      setFlags(flags + 1);
    }
  }

  return (
    <section>
      <div className='flex justify-between text-3xl text-brown font-bold px-2'>
        <span>
          {formatTime(time)}
        </span>
        <span className='flex'>
          <FlagIcon size={25} strokeWidth={3} /> x{flags}
        </span>
      </div>
      <div className='bg-white p-6 board font-bold text-brown text-2xl shadow-md'>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className='flex'>
            {row.map((cell, cellIndex) => (
              <Cell
                key={cellIndex}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                cellValue={cell}
                isClicked={clicked.includes(`${rowIndex}-${cellIndex}`)}
                isFlagged={flagged.includes(`${rowIndex}-${cellIndex}`)}
                onClick={() => handleLeftClick(rowIndex, cellIndex)}
                onContextMenu={(e: any) => { e.preventDefault(); handleRightClick(rowIndex, cellIndex); }}
              />
            ))}
          </div>  
        ))}
      </div>
    </section>
  )
}

export default Board;