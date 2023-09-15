
export class VideoRecorder {

  private readonly FPS: number = 60;
  private readonly MIME_TYPE = "video/webm";

  private _mediaRecorder: MediaRecorder;
  private _chunks: any[];

  constructor(canvas: HTMLCanvasElement, onstop: (blob: Blob) => void) {
    const stream: MediaStream = canvas.captureStream(this.FPS);

    this._mediaRecorder = new MediaRecorder(stream, {
      mimeType: `${this.MIME_TYPE}; codecs=vp9`,
    });

    // Provide recorded data when recording stops
    this._mediaRecorder.onstop = () => {
      const blob = new Blob(this._chunks, { type: this.MIME_TYPE });
      onstop(blob);

    };

    // Record data in chunks array when data is available
    this._mediaRecorder.ondataavailable = (evt) => {
      this._chunks.push(evt.data);
    };
  }



  start() {
    this._chunks = [];

    // Start recording using a 1s / 60 (60fps) timeslice [ie data is made available every 1s)
    this._mediaRecorder.start(1000 / this.FPS);
  }




  stop() {
    this._mediaRecorder.stop();
  }
}