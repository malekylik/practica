import * as dat from 'dat.gui';

import Dicom from './file/Dicom';
import FileSelector from './Component/FileSelector/FileSelector';
import VolumeControls from './VolumeContorols';

export default class App {
    constructor() {
        this.fileSelector = new FileSelector(['.dcm']);

        this._2dR;
    
        this._3dR = new X.renderer3D();
        this._3dR.init();

        this.gui = {
            gui: new dat.GUI(),
        };

        this._3dRendrer = true;
        this.show2D = true;

        this.gui.renderSelectFolder = this.gui.gui.addFolder('Select Renderer:');
        this.gui.renderSelectFolder.add(this, '_3dRendrer').name('3D Renderer').onFinishChange((value) => {
            if (value) {
                cancelAnimationFrame(this._2dR.He);
                this.hide2DRenderer();
                this.reveal3DRenderer();
                this.setControlsFor3D();
                this._3dR.render();
                this.gui.renderControls.open();
            } else {
                cancelAnimationFrame(this._3dR.He);
                this.hide3DRenderer();
                this.reveal2DRenderer();
                this.setControlsFor2D();
                this._2dR.render();
                this.gui.renderControls.open();
            }
        });

        this.gui.renderControls = null;

        this.hideControls();

        this.files = {
            dicom: [],
            currentFileInfo: {
                type: 'dicom',
                index: -1,
            }
        };

        this.currentFile = {
            _2d: {
                volumes: [],
                currentIndex: 0,
                canvases: [],
            },
            _3d: {
                volume: null,
                volumeControls: null,
            }
        };

        Object.defineProperty(this.currentFile._2d, 'volume', {
            get: function () {
                return this.volumes[this.currentIndex];
            }
        });

        Object.defineProperty(this.currentFile._2d, 'renderer', {
            get: function () {
                return this.canvases[this.currentIndex];
            }
        });

        this.onShowtime = this.onShowtime.bind(this);
    }

    setControlsFor2D() {
        if (this.gui.renderControls !== null) {
            this.gui.gui.removeFolder(this.gui.renderControls);
        }

        this.gui.renderControls = this.gui.gui.addFolder('Render Controls');

        this.gui.renderControls.add(this.currentFile._2d, 'currentIndex')
        .min(0)
        .max(this.currentFile._2d.volumes.length - 1)
        .step(1).name('File number:')
        .onChange(() => {
            cancelAnimationFrame(this._2dR.He);
            this.hide2DRenderer();
            this._2dR = this.currentFile._2d.renderer;
            this.reveal2DRenderer();
            this._2dR.render();
        });
    }

    setControlsFor3D() {
        if (this.gui.renderControls !== null) {
            this.gui.gui.removeFolder(this.gui.renderControls);
        }
        this.gui.renderControls = this.gui.gui.addFolder('Render Controls');

        const volumeControls = this.currentFile._3d.volumeControls;

        this.gui.renderControls.add(volumeControls, 'opacity', 0, 1);
        this.gui.renderControls.add(volumeControls, 'lowerThreshold', 0, 1000);
        this.gui.renderControls.add(volumeControls, 'upperThreshold', 0, 2000);
        this.gui.renderControls.add(volumeControls, 'windowLow', 0, 1000);
        this.gui.renderControls.add(volumeControls, 'windowHigh', 0, 1000);
        this.gui.renderControls.addColor(volumeControls, 'minColor');
        this.gui.renderControls.addColor(volumeControls, 'maxColor');
    }

    async selectFiles() {
        const fileSelector = this.fileSelector;
        fileSelector.show();

        let files;

        try {
          files = await fileSelector.getFiles();
        } catch(e) {
          this.selectFiles();
        } finally {
          fileSelector.remove();
        }

        if (files === null) {
            fileSelector.remove();
            this.selectFiles();
        }

        this.addFile(new Dicom(files));

        this.revealControls();

        this._3dR.add(this.currentFile._3d.volume);

        this._3dR.onShowtime = this.onShowtime;

        this._3dR.render();
    }

    addFile(file) {
        this.files.dicom.push(file);
        this.files.currentFileInfo.type = 'dicom';
        this.files.currentFileInfo.index += 1;

        const urls = file.getUrls();

        const _3dVolume = new X.volume();
        _3dVolume.file = urls;

        this.currentFile._3d.volume = _3dVolume;
        this.currentFile._3d.volumeControls = new VolumeControls(_3dVolume);

        this.currentFile._2d.volumes = urls.map((url) => {
            const _2dVolume = new X.volume();
            _2dVolume.file = url;
            _2dVolume.borders = false;

            return _2dVolume;
        });

        this.currentFile._2d.canvases = this.currentFile._2d.volumes.map((volume) => {
            const renderer = new X.renderer2D();
            renderer.orientation = 'Z';
            renderer.init();
            renderer.add(volume);

            renderer.T.Re.H.style.display = 'none';

            return renderer;
        });

        this._2dR = this.currentFile._2d.renderer;
    }

    hideControls() {
        this.gui.gui.domElement.style.display = 'none';
    }

    revealControls() {
        this.gui.gui.domElement.style.display = 'initial';
    }

    hide2DRenderer() {
        this._2dR.T.Re.H.style.display = 'none';
    }

    reveal2DRenderer() {
        this._2dR.T.Re.H.style.display = 'initial';
    }

    hide3DRenderer() {
        this._3dR.na.style.display = 'none';
    }

    reveal3DRenderer() {
        this._3dR.na.style.display = 'initial';
    }

    onShowtime() {
        this.currentFile._3d.volumeControls.initDefault();

        this.setControlsFor3D();
    
        this._3dR.camera.position = [0, 0, this.currentFile._3d.volume.dimensions[0]];   
        this.gui.renderSelectFolder.open();
        this.gui.renderControls.open();
    }
}
