import * as dat from 'dat.gui';

import Dicom from './file/Dicom';
import FileSelector from './Component/FileSelector/FileSelector';
import VolumeControls from './VolumeContorols';

export default class App {
    constructor() {
        this.fileSelector = new FileSelector(['.dcm']);

        this._2dR = new X.renderer2D();
        this._2dR.orientation = 'Z';
        this._2dR.init();

        this.hide2DRenderer();
    
        this._3dR = new X.renderer3D();
        this._3dR.init();

        this.gui = {
            gui: new dat.GUI(),
        };

        this._3dRendrer = true;

        this.gui.renderSelectFolder = this.gui.gui.addFolder('Select Renderer:');
        this.gui.renderSelectFolder.add(this, '_3dRendrer').name('3D Renderer').onFinishChange((value) => {
            if (value) {
                this.hide2DRenderer();
                this.reveal3DRenderer();
            } else {
                this.hide3DRenderer();
                this.reveal2DRenderer();
            }
        });

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
                currentIndex: 0
            },
            _3d: {
                volume: null,
                volumeControls: null

            }
        };

        Object.defineProperty(this.currentFile._2d, 'volume', {
            get: function () {
                return this.volumes[this.currentIndex];
            }
        });

        this.onShowtime = this.onShowtime.bind(this);
    }

    async selectFiles() {
        const fileSelector = this.fileSelector;
        fileSelector.show();

        let files;

        try {
          files = await fileSelector.getFiles();
        } catch(e) {
          selectFiles();
        } finally {
          fileSelector.remove();
        }

        this.addFile(new Dicom(files));

        this._2dR.add(this.currentFile._2d.volume);
        this._2dR.render();

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
            return _2dVolume;
        });
    }

    hideControls() {
        this.gui.gui.domElement.style.display = 'none';
    }

    revealControls() {
        this.gui.gui.domElement.style.display = 'initial';
    }

    hide2DRenderer() {
        this._2dR.ga.style.display = 'none';
    }

    reveal2DRenderer() {
        this._2dR.ga.style.display = 'initial';
    }

    hide3DRenderer() {
        this._3dR.ga.style.display = 'none';
    }

    reveal3DRenderer() {
        this._3dR.ga.style.display = 'initial';
    }

    onShowtime() {
        const volumeControls = this.currentFile._3d.volumeControls;

        volumeControls.initDefault();

        // this.gui3D.add(volumeControls, 'opacity', 0, 1);
        // this.gui3D.add(volumeControls, 'lowerThreshold', 0, 1000);
        // this.gui3D.add(volumeControls, 'upperThreshold', 0, 2000);
        // this.gui3D.add(volumeControls, 'windowLow', 0, 1000);
        // this.gui3D.add(volumeControls, 'windowHigh', 0, 1000);
        // this.gui3D.addColor(volumeControls, 'minColor');
        // this.gui3D.addColor(volumeControls, 'maxColor');
    
        this._3dR.camera.position = [0, 0, volumeControls.getVolume().dimensions[0]];   
        this.revealControls();
    }
}
