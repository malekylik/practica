export default class VolumeControls {
    constructor(v) {
        this.volume = v;
    }

    initDefault() {
        this.volume.volumeRendering = true;
        this.volume.lowerThreshold = 80;
        this.volume.upperThreshold = 1200;
        this.volume.windowLow = 115;
        this.volume.windowHigh = 360;
        this.volume.minColor = [0.2, 0.06666666666666667, 1];
        this.volume.maxColor = [0.5843137254901961, 1, 0];
        this.volume.opacity = 0.2;
    }

    setVolumeRendering(volumeRendering = true) {
        this.volume.volumeRendering = volumeRendering;
    }

    getVolume() {
        return this.volume;
    }

    get opacity() {
        return this.volume.opacity;
    }

    set opacity(opacity) {
        this.volume.opacity = opacity;
    }

    get lowerThreshold() {
        return this.volume.lowerThreshold;
    }

    set lowerThreshold(lowerThreshold) {
        this.volume.lowerThreshold = lowerThreshold;
    }

    get upperThreshold() {
        return this.volume.upperThreshold;
    }

    set upperThreshold(upperThreshold) {
        this.volume.upperThreshold = upperThreshold;
    }

    get windowLow() {
        return this.volume.windowLow;
    }

    set windowLow(windowLow) {
        this.volume.windowLow = windowLow;
    }

    get windowHigh() {
        return this.volume.windowHigh;
    }

    set windowHigh(windowHigh) {
        this.volume.windowHigh = windowHigh;
    }

    get minColor() {
        return [this.volume.minColor[0] * 256, this.volume.minColor[1] * 256, this.volume.minColor[2] * 256];
    }

    set minColor(minColor) {
        this.volume.minColor[0] = minColor[0] / 256; 
        this.volume.minColor[1] = minColor[1] / 256; 
        this.volume.minColor[2] = minColor[2] / 256; 
    }

    get maxColor() {
        return [this.volume.maxColor[0] * 256, this.volume.maxColor[1] * 256, this.volume.maxColor[2] * 256];
    }

    set maxColor(maxColor) {
        this.volume.maxColor[0] = maxColor[0] / 256; 
        this.volume.maxColor[1] = maxColor[1] / 256; 
        this.volume.maxColor[2] = maxColor[2] / 256; 
    }    
}
