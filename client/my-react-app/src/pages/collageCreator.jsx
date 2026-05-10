import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stage, Layer, Rect } from 'react-konva';
import CollageBox from '../components/collageBox.jsx';
import { fetchColors } from './features/colorForecasting/data/colorService';
import { fetchColorStoriesByColor } from './features/colorForecasting/data/colorStoryService';
import { supabase } from '../lib/supabaseClient';
import './collageCreator.css';

const GRID_SIZE = 20;
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;
const MAX_CROP_ZOOM = 4;
const CROP_PREVIEW_MAX = 520;
const CROP_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getImageCropProps(item, overrides = {}) {
  const sourceWidth = Number(item.sourceWidth || item.width || BASE_WIDTH);
  const sourceHeight = Number(item.sourceHeight || item.height || BASE_HEIGHT);
  const frameWidth = Number(item.width || sourceWidth);
  const frameHeight = Number(item.height || sourceHeight);

  if (!sourceWidth || !sourceHeight || !frameWidth || !frameHeight) {
    return {
      cropX: 0,
      cropY: 0,
      cropWidth: sourceWidth || frameWidth,
      cropHeight: sourceHeight || frameHeight,
      cropZoom: 1,
      cropFocusX: 0.5,
      cropFocusY: 0.5
    };
  }

  const zoom = clamp(Number(overrides.cropZoom ?? item.cropZoom ?? 1), 1, MAX_CROP_ZOOM);
  const frameAspect = frameWidth / frameHeight;
  const sourceAspect = sourceWidth / sourceHeight;

  let baseCropWidth = sourceWidth;
  let baseCropHeight = sourceHeight;

  if (sourceAspect > frameAspect) {
    baseCropWidth = sourceHeight * frameAspect;
  } else {
    baseCropHeight = sourceWidth / frameAspect;
  }

  const minCropWidth = baseCropWidth / MAX_CROP_ZOOM;
  const maxCropWidth = baseCropWidth;
  const explicitWidth = overrides.cropWidth;
  const explicitHeight = overrides.cropHeight;
  const widthFromHeight = explicitHeight != null ? Number(explicitHeight) * frameAspect : null;
  const requestedWidth = explicitWidth != null ? Number(explicitWidth) : widthFromHeight;
  const cropWidth = requestedWidth != null
    ? clamp(requestedWidth, minCropWidth, maxCropWidth)
    : clamp(baseCropWidth / zoom, minCropWidth, maxCropWidth);
  const cropHeight = clamp(cropWidth / frameAspect, baseCropHeight / MAX_CROP_ZOOM, baseCropHeight);
  const resolvedZoom = baseCropWidth / cropWidth;
  const maxCropX = Math.max(0, sourceWidth - cropWidth);
  const maxCropY = Math.max(0, sourceHeight - cropHeight);
  const derivedFocusX = overrides.cropX != null
    ? (maxCropX ? Number(overrides.cropX) / maxCropX : 0.5)
    : Number(overrides.cropFocusX ?? item.cropFocusX ?? 0.5);
  const derivedFocusY = overrides.cropY != null
    ? (maxCropY ? Number(overrides.cropY) / maxCropY : 0.5)
    : Number(overrides.cropFocusY ?? item.cropFocusY ?? 0.5);
  const focusX = clamp(derivedFocusX, 0, 1);
  const focusY = clamp(derivedFocusY, 0, 1);
  const cropX = Math.round(maxCropX * focusX);
  const cropY = Math.round(maxCropY * focusY);

  return {
    cropX,
    cropY,
    cropWidth: Math.round(cropWidth),
    cropHeight: Math.round(cropHeight),
    cropZoom: Number(resolvedZoom.toFixed(4)),
    cropFocusX: focusX,
    cropFocusY: focusY
  };
}

export default function CollagePage() {
  const [rects, setRects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [savedColors, setSavedColors] = useState([]);
  const [activeLibraryColorId, setActiveLibraryColorId] = useState(null);
  const [activeLibraryStory, setActiveLibraryStory] = useState(null);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stageSize, setStageSize] = useState({ width: BASE_WIDTH, height: BASE_HEIGHT, scale: 1 });
  const [contextMenu, setContextMenu] = useState(null);
  const [cropEditorId, setCropEditorId] = useState(null);
  const [cropDraft, setCropDraft] = useState(null);

  const stageRef = useRef();
  const containerRef = useRef();
  const cropDragRef = useRef(null);

  const updateRectById = (id, updater) => {
    setRects((prev) => prev.map((item) => (
      item.id === id
        ? { ...item, ...(typeof updater === 'function' ? updater(item) : updater) }
        : item
    )));
  };

  useEffect(() => {
    let isMounted = true;

    async function syncSessionState() {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error('Unable to load session for collage editor:', error);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(Boolean(session));
    }

    void syncSessionState();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setIsAuthenticated(Boolean(session));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadSavedColors() {
      if (!isAuthenticated) {
        setSavedColors([]);
        setActiveLibraryColorId(null);
        setActiveLibraryStory(null);
        return;
      }

      try {
        const data = await fetchColors();
        setSavedColors(data || []);
      } catch (error) {
        console.error('Unable to load saved colors:', error);
        setSavedColors([]);
      }
    }

    loadSavedColors();
  }, [isAuthenticated]);

  useEffect(() => {
    async function loadActiveStory() {
      if (!isAuthenticated) {
        setActiveLibraryStory(null);
        return;
      }

      if (!activeLibraryColorId) {
        setActiveLibraryStory(null);
        return;
      }

      setIsLoadingStory(true);

      try {
        const stories = await fetchColorStoriesByColor(activeLibraryColorId);
        const nextStory = (stories || [])[0] || null;
        setActiveLibraryStory(nextStory);
      } catch (error) {
        console.error('Unable to load color story:', error);
        setActiveLibraryStory(null);
      } finally {
        setIsLoadingStory(false);
      }
    }

    loadActiveStory();
  }, [activeLibraryColorId, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / BASE_WIDTH;
        if (newScale < 1) {
          setStageSize({
            width: containerWidth,
            height: BASE_HEIGHT * newScale,
            scale: newScale
          });
        } else {
          setStageSize({ width: BASE_WIDTH, height: BASE_HEIGHT, scale: 1 });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';

      if (!isTyping && (e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
        setRects(prev => prev.filter(r => r.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);

    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, []);

  useEffect(() => () => {
    window.removeEventListener('mousemove', handleCropWindowMove);
    window.removeEventListener('mouseup', stopCropPointerDrag);
    window.removeEventListener('touchmove', handleCropWindowTouchMove);
    window.removeEventListener('touchend', stopCropPointerDrag);
  }, []);

  const addBox = () => {
    const id = `rect${Date.now()}`;
    setRects([...rects, { id, x: 40, y: 40, width: 250, height: 60, fill: '#000000', type: 'rect' }]);
    setSelectedId(id);
  };

  const addText = () => {
    const id = `text${Date.now()}`;
    setRects([...rects, {
      id, x: 100, y: 100, text: 'NEW TEXT', fontSize: 40,
      fontFamily: 'Arial', fill: '#000000', type: 'text'
    }]);
    setSelectedId(id);
  };

  const selectedItem = rects.find(r => r.id === selectedId);

  const addStoryTextToCanvas = (text) => {
    if (!text || !text.trim()) {
      return;
    }

    if (selectedItem?.type === 'text') {
      updateRectById(selectedId, { text });
      return;
    }

    const id = `text${Date.now()}`;
    setRects((prev) => [...prev, {
      id,
      x: 80,
      y: 80,
      text,
      fontSize: 28,
      width: 320,
      fontFamily: 'Arial',
      fill: '#111111',
      type: 'text'
    }]);
    setSelectedId(id);
  };

  const addColorSwatchToCanvas = (color) => {
    if (!color) {
      return;
    }

    const id = `swatch${Date.now()}`;
    setRects((prev) => [...prev, {
      id,
      x: 80,
      y: 80,
      width: 180,
      height: 260,
      fill: color.hex,
      hex: color.hex,
      name: color.name,
      season: color.season || '',
      type: 'swatchCard'
    }]);
    setSelectedId(id);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const scaleFactor = img.width > 500 ? 500 / img.width : 1;
          const width = Math.round((img.width * scaleFactor) / GRID_SIZE) * GRID_SIZE;
          const height = Math.round((img.height * scaleFactor) / GRID_SIZE) * GRID_SIZE;
          const nextImage = {
            id: `img${Date.now()}-${Math.random()}`,
            x: GRID_SIZE * 2,
            y: GRID_SIZE * 2,
            width,
            height,
            imageSrc: event.target.result,
            sourceWidth: img.width,
            sourceHeight: img.height,
            type: 'image'
          };

          setRects(prev => [...prev, {
            ...nextImage,
            ...getImageCropProps(nextImage)
          }]);
        };
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const moveLayer = (direction) => {
    if (!selectedId) return;
    const index = rects.findIndex(r => r.id === selectedId);
    const newRects = [...rects];
    const element = newRects.splice(index, 1)[0];
    direction === 'front' ? newRects.push(element) : newRects.unshift(element);
    setRects(newRects);
  };

  const downloadPNG = () => {
    setSelectedId(null);
    requestAnimationFrame(() => {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const customName = window.prompt("Name your collage:", "fashion-collage");
      if (customName) {
        const link = document.createElement('a');
        link.download = `${customName}.png`;
        link.href = uri;
        link.click();
      }
    });
  };

  const deleteItem = (id) => {
    setRects((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    if (cropEditorId === id) {
      setCropEditorId(null);
      setCropDraft(null);
    }
    setContextMenu(null);
  };

  const duplicateItem = (id) => {
    const item = rects.find((rect) => rect.id === id);
    if (!item) {
      return;
    }

    const duplicate = {
      ...item,
      id: `${item.type || 'item'}${Date.now()}`,
      x: item.x + GRID_SIZE,
      y: item.y + GRID_SIZE
    };

    setRects((prev) => [...prev, duplicate]);
    setSelectedId(duplicate.id);
    setContextMenu(null);
  };

  const openCropEditor = (id) => {
    const item = rects.find((rect) => rect.id === id && rect.type === 'image');
    if (!item) {
      return;
    }

    setSelectedId(id);
    setCropEditorId(id);
    setCropDraft({
      id,
      ...getImageCropProps(item)
    });
    setContextMenu(null);
  };

  const updateImageCrop = (id, overrides) => {
    setRects((prev) => prev.map((item) => {
      if (item.id !== id || item.type !== 'image') {
        return item;
      }

      return {
        ...item,
        ...getImageCropProps(item, overrides)
      };
    }));
  };

  const updateCropDraft = (overrides) => {
    if (!cropEditingItem) {
      return;
    }

    setCropDraft((prev) => ({
      id: cropEditingItem.id,
      ...getImageCropProps(cropEditingItem, {
        ...(prev || {}),
        ...overrides
      })
    }));
  };

  const resetImageCrop = (id) => {
    if (cropEditorId === id) {
      updateCropDraft({
        cropZoom: 1,
        cropFocusX: 0.5,
        cropFocusY: 0.5
      });
      return;
    }

    updateImageCrop(id, {
      cropZoom: 1,
      cropFocusX: 0.5,
      cropFocusY: 0.5
    });
  };

  const applySavedColor = (color) => {
    const { hex } = color;

    if (!selectedId) {
      setBgColor(hex);
      return;
    }

    setRects((prev) =>
      prev.map((item) => (
        item.id === selectedId && !item.imageSrc
          ? item.type === 'swatchCard'
            ? { ...item, fill: hex, hex: color.hex, name: color.name, season: color.season || '' }
            : { ...item, fill: hex }
          : item
      ))
    );
  };

  const activeLibraryColor = savedColors.find((color) => color.id === activeLibraryColorId);
  const cropEditingItem = rects.find((item) => item.id === cropEditorId && item.type === 'image');
  const cropState = cropDraft && cropEditingItem?.id === cropDraft.id
    ? cropDraft
    : cropEditingItem
      ? { id: cropEditingItem.id, ...getImageCropProps(cropEditingItem) }
      : null;

  const cropPreviewWidth = cropEditingItem
    ? Math.min(CROP_PREVIEW_MAX, cropEditingItem.sourceWidth || cropEditingItem.width)
    : 0;
  const cropPreviewHeight = cropEditingItem
    ? Math.round(cropPreviewWidth * ((cropEditingItem.sourceHeight || cropEditingItem.height) / (cropEditingItem.sourceWidth || cropEditingItem.width || 1)))
    : 0;
  const cropScale = cropEditingItem && cropPreviewWidth
    ? cropPreviewWidth / (cropEditingItem.sourceWidth || cropEditingItem.width || cropPreviewWidth)
    : 1;

  const applyCropInteraction = (clientX, clientY) => {
    if (!cropEditingItem || !cropState || !cropDragRef.current) {
      return;
    }

    const sourceWidth = cropEditingItem.sourceWidth || cropEditingItem.width;
    const sourceHeight = cropEditingItem.sourceHeight || cropEditingItem.height;
    const frameAspect = (cropEditingItem.width || 1) / (cropEditingItem.height || 1);
    const baseCropWidth = Math.min(sourceWidth, sourceHeight * frameAspect);
    const minCropWidth = baseCropWidth / MAX_CROP_ZOOM;
    const maxCropWidth = baseCropWidth;
    const deltaX = (clientX - cropDragRef.current.startX) / cropScale;
    const deltaY = (clientY - cropDragRef.current.startY) / cropScale;

    if (cropDragRef.current.mode === 'move') {
      const maxCropX = Math.max(0, sourceWidth - cropState.cropWidth);
      const maxCropY = Math.max(0, sourceHeight - cropState.cropHeight);

      updateCropDraft({
        cropX: clamp(cropDragRef.current.cropX + deltaX, 0, maxCropX),
        cropY: clamp(cropDragRef.current.cropY + deltaY, 0, maxCropY)
      });
      return;
    }

    const handle = cropDragRef.current.handle;
    const isWest = handle.includes('w');
    const isEast = handle.includes('e');
    const isNorth = handle.includes('n');
    const isSouth = handle.includes('s');
    const startWidth = cropDragRef.current.cropWidth;
    const startHeight = cropDragRef.current.cropHeight;

    let widthFromHorizontal = startWidth;
    let widthFromVertical = startWidth;

    if (isWest) {
      widthFromHorizontal = startWidth - deltaX;
    } else if (isEast) {
      widthFromHorizontal = startWidth + deltaX;
    }

    if (isNorth) {
      widthFromVertical = (startHeight - deltaY) * frameAspect;
    } else if (isSouth) {
      widthFromVertical = (startHeight + deltaY) * frameAspect;
    }

    let requestedWidth = startWidth;
    if ((isWest || isEast) && (isNorth || isSouth)) {
      const weightedHorizontal = Math.abs(deltaX);
      const weightedVertical = Math.abs(deltaY * frameAspect);
      requestedWidth = weightedHorizontal >= weightedVertical ? widthFromHorizontal : widthFromVertical;
    } else if (isWest || isEast) {
      requestedWidth = widthFromHorizontal;
    } else if (isNorth || isSouth) {
      requestedWidth = widthFromVertical;
    }

    const anchorX = isWest ? cropDragRef.current.cropX + startWidth : cropDragRef.current.cropX;
    const anchorY = isNorth ? cropDragRef.current.cropY + startHeight : cropDragRef.current.cropY;
    const maxWidthByHorizontal = isWest ? anchorX : sourceWidth - anchorX;
    const maxHeightByVertical = isNorth ? anchorY : sourceHeight - anchorY;
    const maxWidth = Math.min(maxCropWidth, maxWidthByHorizontal, maxHeightByVertical * frameAspect);
    const nextWidth = clamp(requestedWidth, minCropWidth, maxWidth);
    const nextHeight = nextWidth / frameAspect;
    const nextX = isWest ? anchorX - nextWidth : anchorX;
    const nextY = isNorth ? anchorY - nextHeight : anchorY;

    updateCropDraft({
      cropX: nextX,
      cropY: nextY,
      cropWidth: nextWidth,
      cropHeight: nextHeight
    });
  };

  const handleCropWindowMove = (event) => {
    applyCropInteraction(event.clientX, event.clientY);
  };

  const handleCropWindowTouchMove = (event) => {
    if (!event.touches?.[0]) {
      return;
    }

    event.preventDefault();
    applyCropInteraction(event.touches[0].clientX, event.touches[0].clientY);
  };

  const stopCropPointerDrag = () => {
    cropDragRef.current = null;
    window.removeEventListener('mousemove', handleCropWindowMove);
    window.removeEventListener('mouseup', stopCropPointerDrag);
    window.removeEventListener('touchmove', handleCropWindowTouchMove);
    window.removeEventListener('touchend', stopCropPointerDrag);
  };

  const beginCropInteraction = (event, mode, handle = null) => {
    if (!cropEditingItem || !cropState) {
      return;
    }

    event.preventDefault?.();
    event.stopPropagation?.();
    cropDragRef.current = {
      mode,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      cropX: cropState.cropX,
      cropY: cropState.cropY,
      cropWidth: cropState.cropWidth,
      cropHeight: cropState.cropHeight
    };

    window.addEventListener('mousemove', handleCropWindowMove);
    window.addEventListener('mouseup', stopCropPointerDrag);
    window.addEventListener('touchmove', handleCropWindowTouchMove, { passive: false });
    window.addEventListener('touchend', stopCropPointerDrag);
  };

  const handleCropPointerDown = (event) => {
    beginCropInteraction(event, 'move');
  };

  const handleCropHandlePointerDown = (event, handle) => {
    beginCropInteraction(event, 'resize', handle);
  };

  const finalizeCrop = () => {
    if (!cropEditingItem || !cropState) {
      return;
    }

    updateImageCrop(cropEditingItem.id, cropState);
    setCropEditorId(null);
    setCropDraft(null);
  };

  const cancelCrop = () => {
    setCropEditorId(null);
    setCropDraft(null);
  };

  return (
    <div className="collage-app">
      <aside className="sidebar">
        <h2 className="sidebar-title">Editor</h2>

        <div className="tool-section">
          <label>Elements</label>
          <button className="secondary-btn" onClick={addBox}>+ Add Block</button>
          <button className="secondary-btn" onClick={addText}>+ Add Text</button>
        </div>

        <div className="tool-section">
          <label>Photos</label>
          <input type="file" id="file-upload" multiple accept="image/*" onChange={handleImageUpload} hidden />
          <label htmlFor="file-upload" className="upload-label">Upload Images</label>
        </div>

        <div className="tool-section">
          <label>Background</label>
          <div className="color-picker-wrapper">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            <span>{bgColor.toUpperCase()}</span>
          </div>
        </div>

        <div className="tool-section">
          <label>Color Library</label>
          {!isAuthenticated ? (
            <Link to="/signin" className="saved-colors-empty-link">
              <span className="saved-colors-empty">
                Sign in to use your Color Forecasting library here.
              </span>
            </Link>
          ) : savedColors.length ? (
            <div className="saved-colors-list">
              {savedColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`saved-color-card${activeLibraryColorId === color.id ? ' is-active' : ''}`}
                  onClick={() => {
                    setActiveLibraryColorId(color.id);
                    applySavedColor(color);
                  }}
                  title={
                    selectedId
                      ? `Apply ${color.name} to selected item`
                      : `Apply ${color.name} to background`
                  }
                >
                  <span
                    className="saved-color-swatch"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <span className="saved-color-meta">
                    <span className="saved-color-name">{color.name}</span>
                    <span className="saved-color-hex">{color.hex}</span>
                    <span className="saved-color-season">
                      {color.season || 'Uncategorized'}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Link to="/color" className="saved-colors-empty-link">
              <span className="saved-colors-empty">
                Add colors in Color Forecasting to use them here.
              </span>
            </Link>
          )}

          {activeLibraryColor && (
            <div className="story-panel">
              <p className="story-panel-label">
                {activeLibraryColor.name} Story
              </p>

              {isLoadingStory ? (
                <p className="story-panel-empty">Loading story...</p>
              ) : activeLibraryStory ? (
                <>
                  <div className="story-panel-copy">
                    <strong>Narrative</strong>
                    <p>{activeLibraryStory.narrative}</p>
                  </div>

                  <div className="story-panel-copy">
                    <strong>Design Application</strong>
                    <p>{activeLibraryStory.design_application}</p>
                  </div>

                  <div className="story-panel-copy">
                    <strong>Fabric Suggestions</strong>
                    <p>{activeLibraryStory.fabric_suggestions}</p>
                  </div>

                  <div className="story-panel-actions">
                    <button type="button" className="story-action-btn" onClick={() => addColorSwatchToCanvas(activeLibraryColor)}>
                      Add Color Swatch
                    </button>
                    <button type="button" className="story-action-btn" onClick={() => addStoryTextToCanvas(activeLibraryStory.narrative)}>
                      Add Narrative
                    </button>
                    <button type="button" className="story-action-btn" onClick={() => addStoryTextToCanvas(activeLibraryStory.design_application)}>
                      Add Design Notes
                    </button>
                    <button type="button" className="story-action-btn" onClick={() => addStoryTextToCanvas(activeLibraryStory.fabric_suggestions)}>
                      Add Fabric Notes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="story-panel-empty">
                    No story yet for this color.
                  </p>
                  <Link
                    to="/color"
                    state={{ selectedColorId: activeLibraryColor.id }}
                    className="story-panel-link"
                  >
                    Open in Color Forecasting
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {selectedId && (
          <div className="tool-section selection-tools">
            <label>Arrangement</label>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <button className="small-btn" onClick={() => moveLayer('front')}>Front</button>
              <button className="small-btn" onClick={() => moveLayer('back')}>Back</button>
            </div>

            {selectedItem?.type === 'text' && (
              <div className="text-edit-group">
                <label>Content</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedItem.text}
                  onChange={(e) => updateRectById(selectedId, { text: e.target.value })}
                />
                <div>
                  <label>Font</label>
                  <select
                    className="font-select"
                    value={selectedItem.fontFamily}
                    onChange={(e) => updateRectById(selectedId, { fontFamily: e.target.value })}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times</option>
                  </select>
                </div>
              </div>
            )}

            {!selectedItem?.imageSrc && (
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={selectedItem?.fill || '#000000'}
                  onChange={(e) => updateRectById(selectedId, { fill: e.target.value })}
                />
                <span>Edit Color</span>
              </div>
            )}
            <button className="delete-btn" onClick={() => deleteItem(selectedId)}>Delete</button>
          </div>
        )}

        {cropEditingItem && (
          <div className="tool-section crop-tools">
            <label>Image Crop</label>

            <div className="crop-field">
              <span>Zoom</span>
              <input
                type="range"
                min="1"
                max={String(MAX_CROP_ZOOM)}
                step="0.05"
                value={cropState?.cropZoom || 1}
                onChange={(e) => updateCropDraft({ cropZoom: Number(e.target.value) })}
              />
              <strong>{(cropState?.cropZoom || 1).toFixed(2)}x</strong>
            </div>

            <div className="crop-field">
              <span>Horizontal</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={cropState?.cropFocusX || 0.5}
                onChange={(e) => updateCropDraft({ cropFocusX: Number(e.target.value) })}
              />
            </div>

            <div className="crop-field">
              <span>Vertical</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={cropState?.cropFocusY || 0.5}
                onChange={(e) => updateCropDraft({ cropFocusY: Number(e.target.value) })}
              />
            </div>

            <div className="crop-actions">
              <button className="small-btn" onClick={() => resetImageCrop(cropEditingItem.id)}>Reset Crop</button>
              <button className="small-btn" onClick={finalizeCrop}>Done</button>
            </div>
          </div>
        )}

        <button onClick={downloadPNG} className="download-btn">Download PNG</button>
      </aside>

      <main className="canvas-area" ref={containerRef}>
        <div className="canvas-wrapper">
          <Stage
            width={stageSize.width} height={stageSize.height}
            scaleX={stageSize.scale} scaleY={stageSize.scale}
            ref={stageRef} className="canvas-stage"
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
                setCropEditorId(null);
              }
              setContextMenu(null);
            }}
          >
            <Layer>
              <Rect
                width={BASE_WIDTH}
                height={BASE_HEIGHT}
                fill={bgColor}
                onMouseDown={() => setSelectedId(null)}
                onTap={() => setSelectedId(null)}
              />
              {rects.map((rect, i) => (
                <CollageBox
                  key={rect.id} shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => setSelectedId(rect.id)}
                  onContextMenu={(event) => {
                    event.evt.preventDefault();
                    setSelectedId(rect.id);
                    setContextMenu({
                      x: event.evt.clientX,
                      y: event.evt.clientY,
                      id: rect.id,
                      type: rect.type
                    });
                  }}
                  gridSize={GRID_SIZE}
                  onChange={(newAttrs) => {
                    const newList = [...rects];
                    newList[i] = newAttrs.type === 'image'
                      ? {
                          ...newAttrs,
                          ...getImageCropProps(newAttrs)
                        }
                      : newAttrs;
                    setRects(newList);
                  }}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </main>

      {contextMenu && (
        <div
          className="canvas-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'image' && (
            <button type="button" onClick={() => openCropEditor(contextMenu.id)}>
              Crop
            </button>
          )}
          <button type="button" onClick={() => duplicateItem(contextMenu.id)}>
            Duplicate
          </button>
          <button type="button" className="danger" onClick={() => deleteItem(contextMenu.id)}>
            Delete
          </button>
        </div>
      )}

      {cropEditingItem && cropState && (
        <div className="crop-overlay">
          <div className="crop-panel">
            <div className="crop-panel-header">
              <div>
                <p className="crop-panel-label">Crop Image</p>
                <p className="crop-panel-note">Drag the crop window, then confirm.</p>
              </div>
              <div className="crop-panel-actions">
                <button type="button" className="crop-icon-btn" onClick={cancelCrop} aria-label="Cancel crop">
                  ×
                </button>
                <button type="button" className="crop-icon-btn crop-icon-btn-confirm" onClick={finalizeCrop} aria-label="Finalize crop">
                  ✓
                </button>
              </div>
            </div>

            <div className="crop-preview-shell">
              <div
                className="crop-preview"
                style={{
                  width: cropPreviewWidth,
                  height: cropPreviewHeight
                }}
              >
                <img
                  src={cropEditingItem.imageSrc}
                  alt=""
                  draggable="false"
                  className="crop-preview-image"
                  style={{
                    width: cropPreviewWidth,
                    height: cropPreviewHeight
                  }}
                />
                <div
                  className="crop-selection"
                  onMouseDown={handleCropPointerDown}
                  onTouchStart={(e) => handleCropPointerDown({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY,
                    preventDefault: () => e.preventDefault(),
                    stopPropagation: () => e.stopPropagation()
                  })}
                  style={{
                    left: cropState.cropX * cropScale,
                    top: cropState.cropY * cropScale,
                    width: cropState.cropWidth * cropScale,
                    height: cropState.cropHeight * cropScale
                  }}
                >
                  <span className="crop-selection-badge">Drag Crop</span>
                  {CROP_HANDLES.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      className={`crop-handle crop-handle-${handle}`}
                      onMouseDown={(event) => handleCropHandlePointerDown(event, handle)}
                      onTouchStart={(e) => handleCropHandlePointerDown({
                        clientX: e.touches[0].clientX,
                        clientY: e.touches[0].clientY,
                        preventDefault: () => e.preventDefault(),
                        stopPropagation: () => e.stopPropagation()
                      }, handle)}
                      aria-label={`Resize crop ${handle}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
