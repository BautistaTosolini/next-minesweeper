interface CellButtonProps {
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isFlagged: boolean;
  children: React.ReactNode;
}

const CellButton = ({ onClick, onContextMenu, isFlagged, children }: CellButtonProps) => (
  <button
    className={`cell-button h-full w-full bg-beige flex items-center justify-center transition ${isFlagged ? 'text-orange hover:text-orange2' : 'hover:brightness-110'}`}
    onClick={onClick}
    onContextMenu={onContextMenu}
  >
    {children}
  </button>
);

export default CellButton;