import { Buffer } from 'buffer';
import { parseBlob } from 'music-metadata-browser';

// Ensure Buffer is available globally for music-metadata-browser
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export interface ID3Metadata {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string[];
  tempo?: number;
  key?: string;
  albumArt?: {
    data: Uint8Array;
    format: string;
  };
  duration?: number;
}

export async function extractID3Metadata(audioFile: File): Promise<ID3Metadata> {
  try {
    const metadata = await parseBlob(audioFile);
    
    const id3Data: ID3Metadata = {
      duration: metadata.format.duration
    };

    // Extract common tags
    if (metadata.common.title) {
      id3Data.title = metadata.common.title;
    }
    
    if (metadata.common.artist) {
      id3Data.artist = metadata.common.artist;
    }
    
    if (metadata.common.album) {
      id3Data.album = metadata.common.album;
    }
    
    if (metadata.common.genre && metadata.common.genre.length > 0) {
      id3Data.genre = metadata.common.genre;
    }
    
    // Extract BPM/tempo
    if (metadata.common.bpm) {
      id3Data.tempo = metadata.common.bpm;
    }
    
    // Extract key
    if (metadata.common.key) {
      id3Data.key = metadata.common.key;
    }
    
    // Extract album art
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      id3Data.albumArt = {
        data: picture.data,
        format: picture.format
      };
    }
    
    console.log('Extracted ID3 metadata:', {
      ...id3Data,
      albumArt: id3Data.albumArt ? 'Present' : 'None'
    });
    
    return id3Data;
  } catch (error) {
    console.error('Error extracting ID3 metadata:', error);
    return {};
  }
}

export async function processAlbumArtWithColorOverlay(
  albumArtData: Uint8Array,
  format: string,
  overlayColor: string = '#cb8145'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Create blob from album art data
    const blob = new Blob([albumArtData], { type: `image/${format}` });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Apply color overlay with multiply blend mode
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Adjust brightness to compensate for multiply darkening
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = overlayColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((resultBlob) => {
        URL.revokeObjectURL(url);
        if (resultBlob) {
          resolve(resultBlob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}
