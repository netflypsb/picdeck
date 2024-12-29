function calculatePosition(
  canvas: HTMLCanvasElement,
  watermarkWidth: number,
  watermarkHeight: number,
  placement: string
): { x: number; y: number } {
  let x = 0, y = 0;
  
  switch (placement) {
    case 'top-left':
      x = 10;
      y = 10;
      break;
    case 'center':
      x = (canvas.width - watermarkWidth) / 2;
      y = (canvas.height - watermarkHeight) / 2;
      break;
    case 'bottom-right':
      x = canvas.width - watermarkWidth - 10;
      y = canvas.height - watermarkHeight - 10;
      break;
  }
  
  return { x, y };
}

function generateTilingPositions(
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const positions = [];
  for (let y = 0; y < canvasHeight; y += watermarkHeight + spacing) {
    for (let x = 0; x < canvasWidth; x += watermarkWidth + spacing) {
      positions.push({ x, y });
    }
  }
  return positions;
}

export async function applyWatermark(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  settings: any
): Promise<void> {
  if (!settings) return;
  console.log('Applying watermark with settings:', settings);

  ctx.save();
  ctx.globalAlpha = settings.transparency / 100;

  if (settings.type === 'image' && settings.imageFile) {
    console.log('Applying image watermark');
    const watermarkImg = await createImageBitmap(settings.imageFile);
    const scaledWidth = canvas.width * (settings.scale / 100);
    const scaledHeight = (watermarkImg.height / watermarkImg.width) * scaledWidth;

    if (settings.tiling) {
      const positions = generateTilingPositions(
        canvas.width,
        canvas.height,
        scaledWidth,
        scaledHeight,
        settings.spacing
      );
      positions.forEach(({ x, y }) => {
        ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
      });
    } else {
      const { x, y } = calculatePosition(canvas, scaledWidth, scaledHeight, settings.placement);
      ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
    }
  } else if (settings.type === 'text' && settings.text) {
    console.log('Applying text watermark');
    const fontSize = Math.floor(canvas.width * (settings.scale / 100));
    ctx.font = `${fontSize}px ${settings.font || 'Arial'}`;
    ctx.fillStyle = settings.color || '#000000';
    
    const metrics = ctx.measureText(settings.text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    if (settings.tiling) {
      const positions = generateTilingPositions(
        canvas.width,
        canvas.height,
        metrics.width,
        textHeight,
        settings.spacing
      );
      positions.forEach(({ x, y }) => {
        ctx.fillText(settings.text!, x, y + textHeight);
      });
    } else {
      const { x, y } = calculatePosition(canvas, metrics.width, textHeight, settings.placement);
      ctx.fillText(settings.text, x, y + textHeight);
    }
  }

  ctx.restore();
}