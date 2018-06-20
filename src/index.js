import X from 'xtk';

window.X = X.X;

//   // create a new X.mesh
//   var porsche = new X.mesh();
//   // .. and associate the .stl to it

//   const modelData = await (await fetch('./assets/porsche.stl')).arrayBuffer();

//   const url = './assets/porsche.stl';



//   porsche.filedata = modelData;

//   const p = new X.parserSTL();
//   p.parse(porsche, porsche, modelData);

window.onload = async () => {
    let filePromise = new Promise((resolve) => {
      file.onchange = (e) => {
        resolve(e.target.files);
      }
    });

    const files = await filePromise;

    console.dir(files);

    const fileReader = new FileReader();

    filePromise = new Promise ((resolve) => {
      fileReader.onloadend = (e) => {
        resolve(e.target.result);
      }
    });

    fileReader.readAsArrayBuffer(files[0]);

    let fileArray = await filePromise;

    const X = window.X;

    const r = new X.renderer3D();
    r.init();






  // create a new X.mesh
  var porsche = new X.mesh();
  // .. and associate the .stl to it

  // const modelData = await (await fetch('./assets/porsche.stl')).arrayBuffer();

  // const url = './assets/porsche.stl';



  porsche.filedata = fileArray;

  const p = new X.parserSTL();
  p.parse(porsche, porsche, fileArray);


  // activate the magic mode which results in a colorful rendering since the
  // point colors are based on the point position
  porsche.magicmode = true;
  // set a caption which appears on mouseover
//   porsche.caption = 'The magic Porsche!';
  
  // .. add the porsche
  r.add(porsche);
  
  // .. and start the loading/rendering
  r.render();
};
