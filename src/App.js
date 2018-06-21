import * as dat from 'dat.gui';

import Dicom from './file/Dicom';
import FileSelector from './Component/FileSelector/FileSelector';
import VolumeControls from './VolumeContorols';

export default class App {
    constructor() {
        this.fileSelector = new FileSelector(['.dcm']);
        this.r3D = new X.renderer3D();
        this.gui3D = new dat.GUI();

        this.hideControls();

        this.filesDicom = [];

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

        const dicom = new Dicom(files);

        const v = new X.volume();

        v.file = dicom.getUrls();
      
        this.filesDicom.push({
            dicom,
            volumeControls: new VolumeControls(v)
        });

        this.r3D.init();

        this.r3D.add(v);

        this.r3D.onShowtime = this.onShowtime;

        this.r3D.render();
    }

    hideControls() {
        this.gui3D.domElement.style.display = 'none';
    }

    revealControls() {
        this.gui3D.domElement.style.display = 'initial';
    }

    onShowtime() {
        const volumeControls = this.filesDicom[this.filesDicom.length - 1].volumeControls;

        volumeControls.initDefault();

        this.gui3D.add(volumeControls, 'opacity', 0, 1);
        this.gui3D.add(volumeControls, 'lowerThreshold', 0, 1000);
        this.gui3D.add(volumeControls, 'upperThreshold', 0, 2000);
        this.gui3D.add(volumeControls, 'windowLow', 0, 1000);
        this.gui3D.add(volumeControls, 'windowHigh', 0, 1000);
        this.gui3D.addColor(volumeControls, 'minColor');
        this.gui3D.addColor(volumeControls, 'maxColor');
    
        this.r3D.camera.position = [0, 0, volumeControls.getVolume().dimensions[0]];   
        this.revealControls();
    }
}
