declare module 'lamejs' {
  export interface Mp3Encoder {
    encodeBuffer(buffer: Int16Array): Uint8Array;
    flush(): Uint8Array;
  }

  export const MPEGMode: {
    STEREO: number;
    JOINT_STEREO: number;
    DUAL_CHANNEL: number;
    MONO: number;
  };

  export function Mp3Encoder(
    channels: number,
    sampleRate: number,
    kbps: number,
    mode?: number
  ): Mp3Encoder;
} 