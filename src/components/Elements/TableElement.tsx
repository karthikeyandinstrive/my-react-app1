import { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import ElementWrapper from './ElementWrapper';
import TableEditor from './TableEditor';
import type { TableElement as TableElementType } from '../../types/presentation';
import './TableElement.css';

interface TableElementProps {
  element: TableElementType;
  isSelected: boolean;
}

function TableElement({ element, isSelected }: TableElementProps) {
  const { actions } = usePresentation();
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleCellDoubleClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = element.cells.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex
          ? { ...cell, text: value }
          : cell
      )
    );

    actions.updateElement({
      ...element,
      cells: newCells,
    });
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingCell(null);
    }
  };

  const handleEditTable = () => {
    setShowEditor(true);
  };

  const handleSaveTable = (updatedElement: TableElementType) => {
    actions.updateElement(updatedElement);
  };

  return (
    <>
      <ElementWrapper element={element} isSelected={isSelected}>
        <div className="table-element" onDoubleClick={handleEditTable}>
        <table
          className="table-content"
          style={{
            borderColor: element.borderColor,
            borderWidth: `${element.borderWidth}px`,
          }}
        >
          <tbody>
            {element.cells.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 && element.headerRow ? 'header-row' : ''}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={`table-cell ${editingCell?.row === rowIndex && editingCell?.col === colIndex ? 'editing' : ''}`}
                    style={{
                      backgroundColor: cell.fillColor || (rowIndex === 0 && element.headerRow ? '#f0f0f0' : '#ffffff'),
                      color: cell.color || '#000000',
                      fontSize: `${cell.fontSize || 12}px`,
                      fontWeight: cell.bold || (rowIndex === 0 && element.headerRow) ? 'bold' : 'normal',
                      fontStyle: cell.italic ? 'italic' : 'normal',
                      textAlign: cell.align || 'left',
                      verticalAlign: cell.valign || 'middle',
                      borderColor: element.borderColor,
                      borderWidth: `${element.borderWidth}px`,
                    }}
                    colSpan={cell.colspan}
                    rowSpan={cell.rowspan}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                      <input
                        type="text"
                        className="cell-input"
                        value={cell.text}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                      />
                    ) : (
                      <span>{cell.text || '\u00A0'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ElementWrapper>
      {showEditor && (
        <TableEditor
          element={element}
          onSave={handleSaveTable}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
}

export default TableElement;
