'use client'

import { Bomb } from 'lucide-react';
import { useState } from 'react';

const Board = ({ matrix }: { matrix: (string | number)[][] }) => {
  return (
    <div className='bg-white p-4 board font-bold text-brown text-2xl'>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className='flex'>
          {row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`h-14 w-14 border border-silver flex justify-center items-center ${cell === 'X' ? 'bg-orange text-white' : ''}`}
              >
                <span>{cell === 'X' ? <Bomb /> : cell === 0 ? null : cell}</span>
              </div>
          ))}
        </div>  
      ))}
    </div>
  )
}

export default Board;