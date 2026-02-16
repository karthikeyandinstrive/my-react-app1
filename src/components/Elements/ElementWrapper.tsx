import { useState, useRef, useEffect, type ReactNode } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import type { SlideElement } from '../../types/presentation';
import './ElementWrapper.css';

interface ElementWrapperProps {
  element: SlideElement;
  isSelected: boolean;
  children: ReactNode;
}

function ElementWrapper({ element, isSelected, children }: ElementWrapperProps) {
  const { actions } = usePresentation();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, elemX: 0, elemY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    actions.selectElement(element.id);

    const canvasElement = elementRef.current?.parentElement;
    if (!canvasElement) return;

    // Store canvas rect for bounds checking
    canvasElement.getBoundingClientRect();

    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      elemX: element.position.x,
      elemY: element.position.y,
    };

    setIsDragging(true);
    e.stopPropagation();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectElement(element.id);

    const canvasElement = elementRef.current?.parentElement;
    if (!canvasElement) return;

    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.position.width,
      height: element.position.height,
    };

    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvasElement = elementRef.current?.parentElement;
    if (!canvasElement) return;

    const canvasRect = canvasElement.getBoundingClientRect();

    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      const newX = Math.max(0, Math.min(100 - element.position.width, dragStartPos.current.elemX + deltaXPercent));
      const newY = Math.max(0, Math.min(100 - element.position.height, dragStartPos.current.elemY + deltaYPercent));

      const updatedElement: SlideElement = {
        ...element,
        position: {
          ...element.position,
          x: newX,
          y: newY,
        },
      };

      actions.updateElement(updatedElement);
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      const deltaWidthPercent = (deltaX / canvasRect.width) * 100;
      const deltaHeightPercent = (deltaY / canvasRect.height) * 100;

      const newWidth = Math.max(5, Math.min(100 - element.position.x, resizeStartPos.current.width + deltaWidthPercent));
      const newHeight = Math.max(5, Math.min(100 - element.position.y, resizeStartPos.current.height + deltaHeightPercent));

      const updatedElement: SlideElement = {
        ...element,
        position: {
          ...element.position,
          width: newWidth,
          height: newHeight,
        },
      };

      actions.updateElement(updatedElement);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Add mouse move and up listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.deleteElement(element.id);
  };

  return (
    <div
      ref={elementRef}
      className={`element-wrapper ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        width: `${element.position.width}%`,
        height: `${element.position.height}%`,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}

      {isSelected && (
        <>
          <div className="element-resize-handle" onMouseDown={handleResizeMouseDown} />
          <button className="element-delete-btn" onClick={handleDelete}>
            ×
          </button>
        </>
      )}
    </div>
  );
}

export default ElementWrapper;
