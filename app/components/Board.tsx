'use client'

import { Bomb } from 'lucide-react';
import { useState } from 'react';

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
  const [status, setStatus] = useState<'playing' | 'lost' | 'win'>('playing');

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

  const handleClick = (rowIndex: number, cellIndex: number) => {
    if (matrix[rowIndex][cellIndex] === 0) {
      const visitedCells = new Set<string>();
      clearSurroundings(rowIndex, cellIndex, visitedCells);
    } 
    else if (matrix[rowIndex][cellIndex] === 'X') {
      setStatus('lost');
      clearBoard();
    }
    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
  }

  return (
    <div className='bg-white p-4 board font-bold text-brown text-2xl'>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className='flex'>
          {row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`h-[8vmin] w-[8vmin] border-[2px] border-silver flex justify-center items-center ${cell === 'X' ? 'bg-orange text-white' : ''}`}
              >
                {clicked.includes(`${rowIndex}-${cellIndex}`) ? (
                  <span>{cell === 'X' ? <Bomb /> : cell === 0 ? null : cell}</span>
                ) : (
                  <button className='cell-button h-full w-full bg-beige' onClick={status === 'playing' ? () => handleClick(rowIndex, cellIndex) : () => {}} />
                )}
              </div>
          ))}
        </div>  
      ))}
    </div>
  )
}

export default Board;