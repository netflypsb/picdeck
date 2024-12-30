// This is a Web Worker file for handling video processing
self.onmessage = async (e) => {
  const { video, watermark, options } = e.data;
  
  try {
    // Process video frames in chunks
    const chunkSize = 30; // Process 30 frames at a time
    let processedFrames = 0;
    
    while (processedFrames < video.frames.length) {
      const chunk = video.frames.slice(
        processedFrames,
        processedFrames + chunkSize
      );
      
      // Process chunk
      for (const frame of chunk) {
        // Apply watermark to frame
        // Send progress updates
        self.postMessage({
          type: 'progress',
          progress: (processedFrames / video.frames.length) * 100
        });
      }
      
      processedFrames += chunk.length;
    }
    
    self.postMessage({ type: 'complete' });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};