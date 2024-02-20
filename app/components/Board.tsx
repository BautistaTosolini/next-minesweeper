'use client'

import { useEffect, useState } from 'react';
import Cell from '@/app/components/Cell';
import { BOMBS_COUNT, CELL_BORDERS, GRID_SIZE } from '@/app/constants';
import { FlagIcon } from 'lucide-react';
import { generateMatrix } from '@/lib/utils';

const Board = () => {
  const [matrix, setMatrix] = useState<(string | number)[][] | null>(null);
  const [clicked, setClicked] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [flags, setFlags] = useState(BOMBS_COUNT)
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'lost' | 'won'>('idle');

  // Reset the board.
  const handleReset = () => {
    const generatedMatrix = generateMatrix();

    setClicked([]);
    setFlagged([]);
    setStatus('idle');
    setFlags(BOMBS_COUNT);
    setMatrix(generatedMatrix);
  }

  // Initialize the board.
  useEffect(() => {
    const generatedMatrix = generateMatrix();

    setMatrix(generatedMatrix);
  }, [])

  // Timer.
  useEffect(() => {
    if (status === 'idle') {
      clearInterval(intervalId!);
      setIntervalId(null);
      setTime(0);
    } else if (status === 'playing' && !intervalId) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    } else if (status === 'lost' || status === 'won') {
      clearInterval(intervalId!);
    }
  }, [status]);

  if (!matrix) return null;

  // Converts the time in minutes:seconds.
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return formattedTime;
  };

  // Clear the entire board when losing.
  const clearBoard = () => {
    const allCells = matrix.flatMap((row, rowIndex) =>
      row.map((cell, cellIndex) => `${rowIndex}-${cellIndex}`)
    );
    setClicked(allCells);
  };

  // If the user clicks in an empty cell, all the adyacent cells will clear until it meets a number.
  const clearSurroundings = (rowIndex: number, cellIndex: number, visitedCells: Set<string>) => {
    const key = `${rowIndex}-${cellIndex}`;
    
    // Checking the cell isn't outside the grid.
    if (visitedCells.has(key) || rowIndex === -1 || rowIndex === 11 || cellIndex === -1 || cellIndex === 11) {
      return;
    }

    // Checking the cell isn't flagged.
    if (flagged.includes(`${rowIndex}-${cellIndex}`)) {
      return;
    }

    visitedCells.add(key);

    // Getting the value of the cell.
    const cellValue = matrix[rowIndex]?.[cellIndex] as number;

    if (cellValue > 0 || cellValue === 0) {
      setClicked((clicked) => clicked.concat(key));
    }

    // If the cell its empty recall the function 9 times (one per cell surrounding).
    if (cellValue === 0) {
      for (const border of CELL_BORDERS) {
        clearSurroundings(rowIndex + border[0], cellIndex + border[1], visitedCells);
      }
    }
  }

  const handleLeftClick = (rowIndex: number, cellIndex: number) => {
    if (status === 'idle') setStatus('playing');

    if (status === 'won' || status === 'lost') return;

    if (flagged.includes(`${rowIndex}-${cellIndex}`)) return;

    if (matrix[rowIndex][cellIndex] === 0) {
      // If the user clicks in an empty cell, all the adyacent cells will clear until it meets a number.
      const visitedCells = new Set<string>();
      clearSurroundings(rowIndex, cellIndex, visitedCells);
    } 
    else if (matrix[rowIndex][cellIndex] === 'X') {
      setStatus('lost');
      setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
      clearBoard();
      return;
    }
    if (clicked.length === (GRID_SIZE * GRID_SIZE) - BOMBS_COUNT) {
      setStatus('won');
      clearBoard();
    }

    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
  }

  const handleRightClick = (rowIndex: number, cellIndex: number) => {
    if (status === 'idle' || status === 'won') return;

    if (!flagged.includes(`${rowIndex}-${cellIndex}`) && flags > 0) {
      // Adding the flag.
      setFlagged((flagged) => flagged.concat(`${rowIndex}-${cellIndex}`));
      setFlags(flags - 1);
    } 
    else if (flagged.includes(`${rowIndex}-${cellIndex}`)) {
      // Removing the flag.
      setFlagged((flagged) => flagged.filter(cell => cell !== `${rowIndex}-${cellIndex}`));
      setFlags(flags + 1);
    }
  }

  return (
    <section className='flex flex-col items-center'>
      <div className='flex justify-between text-3xl text-brown font-bold px-2 w-full'>
        <span>
          {formatTime(time)}
        </span>
        {
          status === 'lost' ? (
            <span className='text-3xl text-brown font-bold'>You lost</span>
          ) : status === 'won' ? (
            <span className='text-3xl text-brown font-bold'>You win</span>
          ) : null
        }
        <span className='flex'>
          <FlagIcon size={25} strokeWidth={3} /> x{flags}
        </span>
      </div>
      <div className={`bg-white p-6 board font-bold text-brown text-2xl shadow-md ${status === 'lost' && 'shake'}`}>
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
      <button
        onClick={handleReset}
        className='text-3xl text-white text-center p-2 pt-4 mt-4 bg-orange reset-button cursor-pointer border-b-[6px] border-orange2 w-60'
      >
        Reset
      </button>
    </section>
  )
}

export default Board;