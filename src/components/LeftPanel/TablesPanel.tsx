import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import { DEFAULT_TABLE_ELEMENT, DEFAULT_TABLE_CELL } from '../../utils/constants';
import type { TableElement, TableCell } from '../../types/presentation';

function TablesPanel() {
  const { actions } = usePresentation();
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  const handleAddTable = (rows: number, cols: number) => {
    const cells: TableCell[][] = Array(rows).fill(null).map((_, rowIdx) =>
      Array(cols).fill(null).map((_, colIdx) => ({
        ...DEFAULT_TABLE_CELL,
        text: rowIdx === 0 ? `Header ${colIdx + 1}` : `Cell ${rowIdx},${colIdx + 1}`,
      }))
    );

    const newTableElement: TableElement = {
      id: uuidv4(),
      type: 'table',
      position: { x: 15, y: 20, width: 70, height: 50 },
      zIndex: 1,
      rows,
      cols,
      cells,
      ...DEFAULT_TABLE_ELEMENT,
    };
    actions.addElement(newTableElement);
  };

  const gridSize = 6;

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h2 className="panel-title">Tables</h2>
        <p className="panel-subtitle">Add tables to your slide</p>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <div className="panel-section-title">Select Size</div>
          <div
            className="table-grid-selector"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: 3,
              padding: 8,
              backgroundColor: 'var(--input-bg, #252540)',
              borderRadius: 8,
            }}
          >
            {Array(gridSize * gridSize).fill(null).map((_, idx) => {
              const row = Math.floor(idx / gridSize);
              const col = idx % gridSize;
              const isHighlighted = hoverCell && row <= hoverCell.row && col <= hoverCell.col;

              return (
                <div
                  key={idx}
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: isHighlighted ? '#6366f1' : 'var(--border-color, #3d3d5c)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={() => setHoverCell({ row, col })}
                  onMouseLeave={() => setHoverCell(null)}
                  onClick={() => handleAddTable(row + 1, col + 1)}
                />
              );
            })}
          </div>
          {hoverCell && (
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-muted, #a0a0b0)' }}>
              {hoverCell.row + 1} x {hoverCell.col + 1}
            </div>
          )}
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Quick Tables</div>
          <button className="panel-add-btn" onClick={() => handleAddTable(3, 3)}>
            3 x 3 Table
          </button>
          <button className="panel-add-btn" style={{ marginTop: 8 }} onClick={() => handleAddTable(4, 4)}>
            4 x 4 Table
          </button>
          <button className="panel-add-btn" style={{ marginTop: 8 }} onClick={() => handleAddTable(5, 2)}>
            5 x 2 Table
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablesPanel;
