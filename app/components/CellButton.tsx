interface CellButtonProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isFlagged: boolean;
  children: React.ReactNode;
}

const CellButton = ({ onClick, onContextMenu, isFlagged, children }: CellButtonProps) => (
  <button
    className={`cell-button h-full w-full bg-beige flex items-center justify-center ${isFlagged && 'text-orange'}`}
    onClick={onClick}
    onContextMenu={onContextMenu}
  >
    {children}
  </button>
);

export default CellButton;