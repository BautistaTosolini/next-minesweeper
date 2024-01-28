import { Bomb, FlagIcon } from 'lucide-react';
import CellButton from '@/app/components/CellButton';

interface CellProps {
  rowIndex: number;
  cellIndex: number;
  cellValue: string | number;
  isClicked: boolean;
  isFlagged: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Cell = ({ rowIndex, cellIndex, cellValue, isClicked, isFlagged, onClick, onContextMenu }: CellProps) => (
  <div
    key={`${rowIndex}-${cellIndex}`}
    className={
      `h-[7vmin] w-[7vmin] border-[2px] border-silver flex justify-center items-center 
      ${cellValue === 'X' && 'bg-orange text-white'}
      ${cellValue === 'X' && isFlagged && 'bg-sky'}`
    }
  >
    {isClicked ? (
      <span>{cellValue === 'X' ? <Bomb /> : cellValue === 0 ? null : cellValue}</span>
    ) : (
      <CellButton onClick={onClick} onContextMenu={onContextMenu} isFlagged={isFlagged}>
        {isFlagged && <FlagIcon size={40} />}
      </CellButton>
    )}
  </div>
);

export default Cell;