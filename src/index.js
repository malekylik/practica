import Dicom from './file/Dicom';
import FileSelector from './Component/FileSelector/FileSelector';

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

  r.add(v);

  r.onShowtime = () => {
    v.volumeRendering = true;
    v.lowerThreshold = 80;
    v.windowLower = 115;
    v.windowHigh = 360;
    v.minColor = [0.2, 0.06666666666666667, 1];
    v.maxColor = [0.5843137254901961, 1, 0];
    v.opacity = 0.2;
  };
  
  r.render();
};
