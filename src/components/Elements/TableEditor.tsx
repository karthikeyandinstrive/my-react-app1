import { useState } from 'react';
import type { TableElement, TableCell } from '../../types/presentation';
import { DEFAULT_TABLE_CELL } from '../../utils/constants';
import './TableEditor.css';

interface TableEditorProps {
  element: TableElement;
  onSave: (updatedElement: TableElement) => void;
  onClose: () => void;
}

function TableEditor({ element, onSave, onClose }: TableEditorProps) {
  const [rows, setRows] = useState(element.rows);
  const [cols, setCols] = useState(element.cols);
  const [cells, setCells] = useState(element.cells);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleAddRow = () => {
    const newRow: TableCell[] = Array(cols).fill(null).map(() => ({ ...DEFAULT_TABLE_CELL }));
    setCells([...cells, newRow]);
    setRows(rows + 1);
  };

  const handleRemoveRow = () => {
    if (rows > 1) {
      setCells(cells.slice(0, -1));
      setRows(rows - 1);
    }
  };

  const handleAddColumn = () => {
    const newCells = cells.map(row => [...row, { ...DEFAULT_TABLE_CELL }]);
    setCells(newCells);
    setCols(cols + 1);
  };

  const handleRemoveColumn = () => {
    if (cols > 1) {
      const newCells = cells.map(row => row.slice(0, -1));
      setCells(newCells);
      setCols(cols - 1);
    }
  };

  const handleCellChange = (rowIdx: number, colIdx: number, field: string, value: any) => {
    const newCells = cells.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIdx && cIdx === colIdx
          ? { ...cell, [field]: value }
          : cell
      )
    );
    setCells(newCells);
  };

  const handleRowChange = (rowIdx: number, field: string, value: any) => {
    const newCells = cells.map((row, rIdx) =>
      rIdx === rowIdx
        ? row.map(cell => ({ ...cell, [field]: value }))
        : row
    );
    setCells(newCells);
  };

  const handleSelectRow = (rowIdx: number) => {
    setSelectedRow(rowIdx);
    setSelectedCell(null);
  };

  const handleSelectCell = (rowIdx: number, colIdx: number) => {
    setSelectedCell({ row: rowIdx, col: colIdx });
    setSelectedRow(null);
  };

  const handleSave = () => {
    onSave({
      ...element,
      rows,
      cols,
      cells,
    });
    onClose();
  };

  return (
    <div className="table-editor-overlay" onClick={onClose}>
      <div className="table-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="table-editor-header">
          <h3>Edit Table</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="table-editor-content">
          <div className="table-editor-controls">
            <div className="control-group">
              <label>Rows: {rows}</label>
              <div className="control-buttons">
                <button onClick={handleAddRow} className="control-btn control-btn-add">+ Add Row</button>
                <button onClick={handleRemoveRow} className="control-btn control-btn-remove" disabled={rows <= 1}>- Remove Row</button>
              </div>
            </div>

            <div className="control-group">
              <label>Columns: {cols}</label>
              <div className="control-buttons">
                <button onClick={handleAddColumn} className="control-btn control-btn-add">+ Add Column</button>
                <button onClick={handleRemoveColumn} className="control-btn control-btn-remove" disabled={cols <= 1}>- Remove Column</button>
              </div>
            </div>
          </div>

          <div className="table-editor-grid">
            <table className="editor-table">
              <tbody>
                {cells.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={selectedRow === rowIdx ? 'selected-row' : ''}
                  >
                    <td className="row-selector">
                      <button
                        className={`row-select-btn ${selectedRow === rowIdx ? 'active' : ''}`}
                        onClick={() => handleSelectRow(rowIdx)}
                        title={`Select Row ${rowIdx + 1}`}
                      >
                        {rowIdx + 1}
                      </button>
                    </td>
                    {row.map((cell, colIdx) => (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        style={{
                          backgroundColor: cell.fillColor || '#FFFFFF',
                          outline: selectedCell?.row === rowIdx && selectedCell?.col === colIdx ? '2px solid #007acc' :
                                   selectedRow === rowIdx ? '2px solid #4A90E2' : 'none',
                        }}
                        onClick={() => handleSelectCell(rowIdx, colIdx)}
                      >
                        <input
                          type="text"
                          value={cell.text}
                          onChange={(e) => handleCellChange(rowIdx, colIdx, 'text', e.target.value)}
                          className="cell-editor-input"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedRow !== null && (
            <div className="cell-formatting">
              <h4>Row {selectedRow + 1} Formatting {selectedRow === 0 ? '(Header)' : ''}</h4>
              <div className="formatting-controls">
                <div className="format-group">
                  <label>Background:</label>
                  <input
                    type="color"
                    value={cells[selectedRow][0].fillColor || '#FFFFFF'}
                    onChange={(e) => handleRowChange(selectedRow, 'fillColor', e.target.value)}
                  />
                </div>
                <div className="format-group">
                  <label>Text Color:</label>
                  <input
                    type="color"
                    value={cells[selectedRow][0].color || '#000000'}
                    onChange={(e) => handleRowChange(selectedRow, 'color', e.target.value)}
                  />
                </div>
                <div className="format-group">
                  <label>Font Size:</label>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={cells[selectedRow][0].fontSize || 12}
                    onChange={(e) => handleRowChange(selectedRow, 'fontSize', parseInt(e.target.value))}
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="format-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={cells[selectedRow][0].bold || false}
                      onChange={(e) => handleRowChange(selectedRow, 'bold', e.target.checked)}
                    />
                    Bold
                  </label>
                </div>
                <div className="format-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={cells[selectedRow][0].italic || false}
                      onChange={(e) => handleRowChange(selectedRow, 'italic', e.target.checked)}
                    />
                    Italic
                  </label>
                </div>
                <div className="format-group">
                  <label>Align:</label>
                  <select
                    value={cells[selectedRow][0].align || 'left'}
                    onChange={(e) => handleRowChange(selectedRow, 'align', e.target.value)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedCell && (
            <div className="cell-formatting">
              <h4>Cell Formatting (R{selectedCell.row + 1}C{selectedCell.col + 1})</h4>
              <div className="formatting-controls">
                <div className="format-group">
                  <label>Background:</label>
                  <input
                    type="color"
                    value={cells[selectedCell.row][selectedCell.col].fillColor || '#FFFFFF'}
                    onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'fillColor', e.target.value)}
                  />
                </div>
                <div className="format-group">
                  <label>Text Color:</label>
                  <input
                    type="color"
                    value={cells[selectedCell.row][selectedCell.col].color || '#000000'}
                    onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'color', e.target.value)}
                  />
                </div>
                <div className="format-group">
                  <label>Font Size:</label>
                  <input
                    type="number"
                    min="8"
                    max="32"
                    value={cells[selectedCell.row][selectedCell.col].fontSize || 12}
                    onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'fontSize', parseInt(e.target.value))}
                    style={{ width: '60px' }}
                  />
                </div>
                <div className="format-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={cells[selectedCell.row][selectedCell.col].bold || false}
                      onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'bold', e.target.checked)}
                    />
                    Bold
                  </label>
                </div>
                <div className="format-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={cells[selectedCell.row][selectedCell.col].italic || false}
                      onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'italic', e.target.checked)}
                    />
                    Italic
                  </label>
                </div>
                <div className="format-group">
                  <label>Align:</label>
                  <select
                    value={cells[selectedCell.row][selectedCell.col].align || 'left'}
                    onChange={(e) => handleCellChange(selectedCell.row, selectedCell.col, 'align', e.target.value)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="table-editor-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleSave} className="btn-save">Save</button>
        </div>
      </div>
    </div>
  );
}

export default TableEditor;
