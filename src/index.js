import * as dat from 'dat.gui';

import Dicom from './file/Dicom';
import FileSelector from './Component/FileSelector/FileSelector';
import VolumeControls from './VolumeContorols';

const xtkScript = document.createElement('script');
xtkScript.src = "xtk.js";
document.getElementsByTagName('head')[0].appendChild(xtkScript);

window.onload = async () => {
  const fileSelector = new FileSelector(['.dcm']);
  fileSelector.show();

  let files;

  try {
    files = await fileSelector.getFiles();
  } catch(e) {
    window.onload();
  } finally {
    fileSelector.remove();
  }

  const dicom = new Dicom(files);

  const X = window.X;

  const r = new X.renderer3D();
  r.init();

  const v = new X.volume();

  v.file = dicom.getUrls();

  const volumeControls = new VolumeControls(v);
  const gui = new dat.GUI();
  
  r.onShowtime = () => {
    volumeControls.initDefault();

    gui.add(volumeControls, 'opacity', 0, 1);
    gui.add(volumeControls, 'lowerThreshold', 0, 1000);
    gui.add(volumeControls, 'upperThreshold', 0, 2000);
    gui.add(volumeControls, 'windowLow', 0, 1000);
    gui.add(volumeControls, 'windowHigh', 0, 1000);
    gui.addColor(volumeControls, 'minColor');
    gui.addColor(volumeControls, 'maxColor');

    r.camera.position = [0, 0, v.dimensions[0]];    
  };

  r.add(v);

  r.render();
};
