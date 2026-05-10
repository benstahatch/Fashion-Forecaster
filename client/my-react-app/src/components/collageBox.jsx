import React, { useRef, useEffect } from 'react';
import { Group, Rect, Image, Transformer, Text } from 'react-konva';
import useImage from 'use-image';

const CollageBox = ({ shapeProps, isSelected, onSelect, onContextMenu, onChange, gridSize }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(shapeProps.imageSrc || '');

  useEffect(() => {
    if (isSelected) {
      const node = shapeRef.current;
      trRef.current.nodes([node]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const baseWidth = shapeProps.width || node.width();
    const baseHeight = shapeProps.height || node.height();

    node.scaleX(1);
    node.scaleY(1);

    const newX = Math.round(node.x() / gridSize) * gridSize;
    const newY = Math.round(node.y() / gridSize) * gridSize;
    const newWidth = Math.round((baseWidth * scaleX) / gridSize) * gridSize;
    const newHeight = Math.round((baseHeight * scaleY) / gridSize) * gridSize;

    if (shapeProps.type === 'text') {
      const nextWidth = Math.max(gridSize * 4, newWidth);
      const nextFontSize = Math.max(12, Math.round((shapeProps.fontSize || 28) * scaleY));

      onChange({
        ...shapeProps,
        x: newX,
        y: newY,
        width: nextWidth,
        fontSize: nextFontSize,
      });
      return;
    }

    if (shapeProps.type === 'swatchCard') {
      onChange({
        ...shapeProps,
        x: newX,
        y: newY,
        width: Math.max(gridSize * 6, newWidth),
        height: Math.max(gridSize * 8, newHeight),
      });
      return;
    }

    if (shapeProps.type === 'storyCard') {
      onChange({
        ...shapeProps,
        x: newX,
        y: newY,
        width: Math.max(gridSize * 8, newWidth),
        height: Math.max(gridSize * 8, newHeight),
      });
      return;
    }

    onChange({
      ...shapeProps,
      x: newX,
      y: newY,
      width: Math.max(gridSize, newWidth),
      height: Math.max(gridSize, newHeight),
    });
  };

  const handleDragEnd = (event) => {
    const node = event.target;

    onChange({
      ...shapeProps,
      x: Math.round(node.x() / gridSize) * gridSize,
      y: Math.round(node.y() / gridSize) * gridSize,
    });
  };

  const commonProps = {
    ref: shapeRef,
    ...shapeProps,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onContextMenu,
    dragBoundFunc: (pos) => ({
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize,
    }),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  let content;

  if (shapeProps.type === 'text') {
    content = (
      <Text
        {...commonProps}
        text={shapeProps.text}
        fontSize={shapeProps.fontSize}
        fontFamily={shapeProps.fontFamily}
        fontStyle={shapeProps.fontStyle}
        textDecoration={shapeProps.textDecoration}
        fill={shapeProps.fill}
        width={shapeProps.width}
      />
    );
  } else if (shapeProps.type === 'storyCard') {
    const padding = Math.max(12, Math.round(shapeProps.width * 0.06));
    const headingSize = Math.max(12, Math.round(shapeProps.width * 0.052));
    const bodyY = padding + headingSize + 14;

    content = (
      <Group {...commonProps}>
        <Rect
          width={shapeProps.width}
          height={shapeProps.height}
          fill="#fbf8f3"
          stroke="#111111"
          strokeWidth={1}
        />
        <Text
          listening={false}
          x={padding}
          y={padding}
          text={shapeProps.heading || 'STORY NOTE'}
          fontFamily="Arial"
          fontStyle="bold"
          fontSize={headingSize}
          letterSpacing={1.2}
          fill="#666666"
          width={Math.max(40, shapeProps.width - padding * 2)}
        />
        <Text
          listening={false}
          x={padding}
          y={bodyY}
          text={shapeProps.text}
          fontFamily={shapeProps.fontFamily || 'Georgia'}
          fontStyle={shapeProps.fontStyle}
          fontSize={shapeProps.fontSize || 18}
          lineHeight={1.45}
          fill={shapeProps.fill || '#111111'}
          width={Math.max(40, shapeProps.width - padding * 2)}
          height={Math.max(40, shapeProps.height - bodyY - padding)}
        />
      </Group>
    );
  } else if (shapeProps.type === 'swatchCard') {
    const swatchHeight = Math.round(shapeProps.height * 0.72);
    const labelHeight = shapeProps.height - swatchHeight;
    const paddingX = Math.max(10, Math.round(shapeProps.width * 0.06));

    content = (
      <Group {...commonProps}>
        <Rect
          width={shapeProps.width}
          height={shapeProps.height}
          fill="#ffffff"
          opacity={0.001}
        />
        <Rect
          listening={false}
          width={shapeProps.width}
          height={swatchHeight}
          fill={shapeProps.fill}
        />
        <Rect
          listening={false}
          y={swatchHeight}
          width={shapeProps.width}
          height={labelHeight}
          fill="#ffffff"
        />
        <Text
          listening={false}
          x={paddingX}
          y={swatchHeight + Math.max(10, Math.round(labelHeight * 0.14))}
          text="PANTONE®"
          fontFamily="Arial"
          fontStyle="bold"
          fontSize={Math.max(18, Math.round(shapeProps.width * 0.12))}
          fill="#111111"
        />
        <Text
          listening={false}
          x={paddingX}
          y={swatchHeight + Math.max(34, Math.round(labelHeight * 0.42))}
          text={shapeProps.hex}
          fontFamily="Arial"
          fontSize={Math.max(12, Math.round(shapeProps.width * 0.07))}
          fill="#111111"
        />
        <Text
          listening={false}
          x={paddingX}
          y={swatchHeight + Math.max(52, Math.round(labelHeight * 0.64))}
          text={shapeProps.name}
          fontFamily="Arial"
          fontStyle="bold"
          fontSize={Math.max(14, Math.round(shapeProps.width * 0.085))}
          fill="#111111"
          width={Math.max(40, shapeProps.width - paddingX * 2)}
        />
      </Group>
    );
  } else if (shapeProps.imageSrc) {
    content = (
      <Image
        image={img}
        cropX={shapeProps.cropX || 0}
        cropY={shapeProps.cropY || 0}
        cropWidth={shapeProps.cropWidth || shapeProps.sourceWidth || shapeProps.width}
        cropHeight={shapeProps.cropHeight || shapeProps.sourceHeight || shapeProps.height}
        {...commonProps}
      />
    );
  } else {
    content = <Rect {...commonProps} />;
  }

  let enabledHandles;
  let shouldKeepRatio = false;

  if (shapeProps.type === 'text') {
    enabledHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'];
  } else if (shapeProps.type === 'storyCard' || shapeProps.type === 'swatchCard') {
    enabledHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle-left', 'middle-right'];
  } else if (shapeProps.type === 'image') {
    enabledHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle-left', 'middle-right'];
    shouldKeepRatio = false;
  } else {
    enabledHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle-left', 'middle-right'];
  }

  return (
    <>
      {content}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={shouldKeepRatio}
          enabledAnchors={enabledHandles}
          anchorDragBoundFunc={(oldPos, newPos) => ({
            x: Math.round(newPos.x / gridSize) * gridSize,
            y: Math.round(newPos.y / gridSize) * gridSize,
          })}
        />
      )}
    </>
  );
};

export default CollageBox;
