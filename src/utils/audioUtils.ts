import lamejs from 'lamejs';

export async function convertWebMToMP3(webmBlob: Blob): Promise<Blob> {
  // First convert WebM to AudioBuffer
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Convert AudioBuffer to MP3 using lamejs
  const mp3Encoder = new lamejs.Mp3Encoder(
    1,                    // Number of channels (1 for mono)
    audioBuffer.sampleRate, // Use the actual sample rate from the buffer
    128                   // Bitrate in kbps
  );
  
  const samples = audioBuffer.getChannelData(0);
  
  // Convert Float32Array to Int16Array
  const sampleSize = samples.length;
  const int16Samples = new Int16Array(sampleSize);
  for (let i = 0; i < sampleSize; i++) {
    // Scale to 16-bit range and clamp
    const s = Math.max(-1, Math.min(1, samples[i]));
    int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Encode to MP3
  const mp3Data = [];
  const blockSize = 1152; // must be multiple of 576
  
  // Process the samples in chunks
  for (let i = 0; i < int16Samples.length; i += blockSize) {
    const sampleChunk = int16Samples.subarray(i, i + blockSize);
    const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }
  
  // Get the last chunk of MP3 data
  const mp3buf = mp3Encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  
  // Combine all chunks into a single Blob
  return new Blob(mp3Data, { type: 'audio/mp3' });
}