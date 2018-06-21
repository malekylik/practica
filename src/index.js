import App from './App';

const xtkScript = document.createElement('script');
xtkScript.src = "xtk.js";
document.getElementsByTagName('head')[0].appendChild(xtkScript);

window.onload = () => {
  const app = new App();
  app.selectFiles();
};
