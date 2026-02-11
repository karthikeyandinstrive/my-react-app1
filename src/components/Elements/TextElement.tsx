import { useState, useRef, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import ElementWrapper from './ElementWrapper';
import type { TextElement as TextElementType } from '../../types/presentation';
import './TextElement.css';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
}

function TextElement({ element, isSelected }: TextElementProps) {
  const { actions } = usePresentation();
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      if (newContent !== element.content) {
        actions.updateElement({
          ...element,
          content: newContent,
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      if (contentRef.current) {
        contentRef.current.innerText = element.content;
      }
    }
    // Allow Tab key for indentation (L2, L3)
    if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const tabNode = document.createTextNode('\t');
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Build text decorations
  const textDecorations: string[] = [];
  if (element.underline) textDecorations.push('underline');
  if (element.strike) textDecorations.push('line-through');

  // Build text shadows (glow + shadow + outline simulation)
  const textShadows: string[] = [];

  // Text outline using multiple shadows for cross-browser support
  if (element.outlineWidth && element.outlineWidth > 0) {
    const ow = element.outlineWidth;
    const oc = element.outlineColor || '#000000';
    // Create outline effect using 8-direction shadows
    textShadows.push(`-${ow}px -${ow}px 0 ${oc}`);
    textShadows.push(`${ow}px -${ow}px 0 ${oc}`);
    textShadows.push(`-${ow}px ${ow}px 0 ${oc}`);
    textShadows.push(`${ow}px ${ow}px 0 ${oc}`);
    textShadows.push(`0 -${ow}px 0 ${oc}`);
    textShadows.push(`0 ${ow}px 0 ${oc}`);
    textShadows.push(`-${ow}px 0 0 ${oc}`);
    textShadows.push(`${ow}px 0 0 ${oc}`);
  }

  // Glow effect
  if (element.glowSize && element.glowSize > 0) {
    const gc = element.glowColor || '#FFFF00';
    // Multiple layers for stronger glow effect
    textShadows.push(`0 0 ${element.glowSize}px ${gc}`);
    textShadows.push(`0 0 ${element.glowSize * 1.5}px ${gc}`);
    textShadows.push(`0 0 ${element.glowSize * 2}px ${gc}`);
    textShadows.push(`0 0 ${element.glowSize * 3}px ${gc}`);
  }

  // Drop shadow
  if (element.shadowBlur && element.shadowBlur > 0) {
    const offsetX = element.shadowOffsetX ?? 2;
    const offsetY = element.shadowOffsetY ?? 2;
    const sc = element.shadowColor || '#000000';
    textShadows.push(`${offsetX}px ${offsetY}px ${element.shadowBlur}px ${sc}`);
  }

  const textStyle: React.CSSProperties = {
    fontSize: element.superscript || element.subscript ? `${element.fontSize * 0.7}px` : `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: textDecorations.length > 0 ? textDecorations.join(' ') : 'none',
    textAlign: element.align,
    verticalAlign: element.superscript ? 'super' : element.subscript ? 'sub' : undefined,
    backgroundColor: element.backgroundColor || undefined,
    // Text shadow for outline, glow, and shadow effects
    textShadow: textShadows.length > 0 ? textShadows.join(', ') : undefined,
  };

  // Container style for highlight and vertical alignment
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: element.valign === 'middle' ? 'center' : element.valign === 'bottom' ? 'flex-end' : 'flex-start',
  };

  // Highlight style (applied to text wrapper)
  const highlightStyle: React.CSSProperties = element.highlight ? {
    backgroundColor: element.highlight,
    padding: '0 2px',
    display: 'inline',
    boxDecorationBreak: 'clone' as const,
  } : {};

  const renderContent = () => {
    const listType = element.listType || 'none';

    // When editing and no list - show plain text editor
    if (isEditing && listType === 'none') {
      return (
        <div style={containerStyle}>
          <div
            ref={contentRef}
            className="text-element editing"
            contentEditable={true}
            suppressContentEditableWarning
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={textStyle}
          >
            {element.content}
          </div>
        </div>
      );
    }

    // No list - render as plain text
    if (listType === 'none') {
      return (
        <div style={containerStyle}>
          <div
            ref={contentRef}
            className="text-element"
            onDoubleClick={handleDoubleClick}
            style={{ ...textStyle, whiteSpace: 'pre-wrap' }}
          >
            {element.highlight ? (
              <span style={highlightStyle}>{element.content}</span>
            ) : (
              element.content
            )}
          </div>
        </div>
      );
    }

    // Render as list (bullets or numbers)
    const lines = element.content.split('\n');
    const rawItems = lines.filter(line => line.trim() !== '');

    // Ensure at least one item
    if (rawItems.length === 0) {
      rawItems.push(element.content || 'Item');
    }

    const isBullets = listType === 'bullets';

    const wrapperStyle: React.CSSProperties = {
      fontSize: `${element.fontSize}px`,
      fontFamily: element.fontFamily,
      color: element.color,
      fontWeight: element.bold ? 'bold' : 'normal',
      fontStyle: element.italic ? 'italic' : 'normal',
      textShadow: textShadows.length > 0 ? textShadows.join(', ') : undefined,
    };

    // Bullet markers for different levels
    const bulletMarkers = ['•', '○', '▪'];

    // Number counters for each level
    const levelCounters = [0, 0, 0];

    // Detect indentation level (tabs or 2+ spaces)
    const getLevel = (line: string): number => {
      const match = line.match(/^(\t+|[ ]{2,})/);
      if (!match) return 0;
      const indent = match[1];
      if (indent.includes('\t')) {
        return Math.min(indent.length, 2); // Max level 2 (0-indexed)
      }
      return Math.min(Math.floor(indent.length / 2), 2);
    };

    // Get number marker based on level (1. a. i.)
    const getNumberMarker = (level: number, count: number): string => {
      if (level === 0) {
        return `${count}.`;
      } else if (level === 1) {
        // a. b. c. ...
        return `${String.fromCharCode(96 + count)}.`;
      } else {
        // i. ii. iii. iv. v. ...
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return `${romanNumerals[count - 1] || count}.`;
      }
    };

    // Render items manually with markers
    const renderListItems = () => {
      // Reset counters
      levelCounters[0] = 0;
      levelCounters[1] = 0;
      levelCounters[2] = 0;

      return rawItems.map((line, idx) => {
        const level = getLevel(line);
        const text = line.trim();

        // Reset lower level counters when going to higher level
        if (level === 0) {
          levelCounters[1] = 0;
          levelCounters[2] = 0;
        } else if (level === 1) {
          levelCounters[2] = 0;
        }

        // Increment counter for current level
        levelCounters[level]++;

        const marker = isBullets
          ? bulletMarkers[level]
          : getNumberMarker(level, levelCounters[level]);

        const indentPx = level * 20; // 20px per level

        return (
          <div
            key={idx}
            style={{ marginBottom: '0.15em', paddingLeft: `${indentPx}px`, cursor: 'text' }}
            onDoubleClick={handleDoubleClick}
          >
            <span style={{ marginRight: '0.4em', minWidth: '1.2em', display: 'inline-block' }}>{marker}</span>
            {element.highlight ? (
              <span style={highlightStyle}>{text}</span>
            ) : text}
          </div>
        );
      });
    };

    // When editing a list - show plain text editor
    if (isEditing) {
      return (
        <div style={containerStyle}>
          <div
            ref={contentRef}
            className="text-element editing"
            contentEditable={true}
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              ...wrapperStyle,
              whiteSpace: 'pre-wrap',
              outline: '2px solid #3b82f6',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {element.content}
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', padding: '0 4px' }}>
            Press Tab at start of line for L2, Tab+Tab for L3
          </div>
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        <div
          className="text-element text-element-list"
          onDoubleClick={handleDoubleClick}
          style={wrapperStyle}
        >
          {renderListItems()}
        </div>
      </div>
    );
  };

  return (
    <ElementWrapper element={element} isSelected={isSelected}>
      {renderContent()}
    </ElementWrapper>
  );
}

export default TextElement;
