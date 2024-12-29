export function applyWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  
  // Configure watermark text
  ctx.font = `${Math.max(width, height) * 0.02}px Arial`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  
  // Add watermark text
  ctx.fillText('Made with PicDeck', width - 10, height - 10);
  
  ctx.restore();
}