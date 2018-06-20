const xtkScript = document.createElement('script');
xtkScript.src = "xtk.js";
document.getElementsByTagName('head')[0].appendChild(xtkScript);

window.onload = async () => {
    let filesPromise = new Promise((resolve) => {
      file.onchange = function(e) {
        resolve(e.target.files);
      }
    });

    const files = await filesPromise;

    console.dir(files);

    const fileReader = new FileReader();

    const X = window.X;

    const r = new X.renderer3D();
    r.init();

    const v = new X.volume();
    const filesUrl = Array.from(files).map(file => URL.createObjectURL(file));

    v.file = filesUrl;

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
