import './FileSelector.css';

export default class FileSelector {
    constructor(supportedFiles = []) {
        this.files = null;
        this.supportedFiles = supportedFiles;

        this.selectFilesHandler = this.selectFilesHandler.bind(this);

        this.initHTML();
    }

    initHTML() {
        const container = document.createElement('div');
        const input = document.createElement('input');
        const labelButton = document.createElement('label');
        const labelDragAndDrop = document.createElement('label');
        const submitButton = document.createElement('button-app');

        container.classList.add('file-selecting-container');
        input.classList.add('file-selecting-input');
        labelButton.classList.add('button-app');
        labelDragAndDrop.classList.add('file-selecting-drag-and-drop');
        labelDragAndDrop.classList.add('file-selecting-drag-and-drop-empty');
        submitButton.classList.add('file-selecting-submit');
        submitButton.classList.add('button-app');

        labelButton.setAttribute('for', 'file-selecting');
        labelDragAndDrop.setAttribute('for', 'file-selecting');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'file-selecting');
        input.setAttribute('id', 'file-selecting');
        input.setAttribute('multiple', '');

        labelButton.innerText = 'Выберите файлы';
        submitButton.innerText = 'Ок';

        if (this.supportedFiles.length !== 0) {
            input.setAttribute('accept', this.supportedFiles.join(', '));
        }

        container.appendChild(input);
        container.appendChild(labelButton);
        container.appendChild(labelDragAndDrop);
        container.appendChild(submitButton);

        this.input = input;
        this.labelButton = labelButton;
        this.labelDragAndDrop = labelDragAndDrop;
        this.submitButton = submitButton;
        this.html = container;

        input.addEventListener('change', this.selectFilesHandler);
        labelDragAndDrop.addEventListener("dragenter", (e) => {
            e.stopPropagation();
            e.preventDefault();

            labelDragAndDrop.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }, false);
        labelDragAndDrop.addEventListener("dragleave", () => {
            labelDragAndDrop.style.backgroundColor = 'initial';
        }, false);
        labelDragAndDrop.addEventListener("dragover",  (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        labelDragAndDrop.addEventListener("drop", this.selectFilesHandler, false);
        labelDragAndDrop.addEventListener("click", (e) => { e.preventDefault(); }, false);
    }

    selectFilesHandler(e) {
        if (e.target.files !== undefined) {
            this.files = Array.from(e.target.files);
        } else {
            e.stopPropagation();
            e.preventDefault();
            this.files = Array.from(e.dataTransfer.files);
        }

        if (this.files.length !== 0) {
            this.labelDragAndDrop.innerText = this.files.map(({ name }) => name).join('\n');

            if (this.labelDragAndDrop.classList.contains('file-selecting-drag-and-drop-empty')) {
                this.labelDragAndDrop.classList.remove('file-selecting-drag-and-drop-empty');
            }
        } else {
            this.labelDragAndDrop.innerText = '';

            if (!(this.labelDragAndDrop.classList.contains('file-selecting-drag-and-drop-empty'))) {
                this.labelDragAndDrop.classList.add('file-selecting-drag-and-drop-empty');
            }
        }

        this.labelDragAndDrop.style.backgroundColor = 'initial';
    }

    getFile(index) {
        if (this.files !== null) {
            if (this.files[index]) {
                return this.files[index];
            }
        }

        return null;
    }

    show() {
        document.body.appendChild(this.html);
    }

    remove() {
        document.body.removeChild(this.html);
    }

    getFiles() {
        return new Promise((resolve, reject) => {
                this.submitButton.onclick = () => {
                    const supportedFiles = this.supportedFiles;
                    const files = this.files;

                    if (files === null) {
                        return null;
                    }

                    if (supportedFiles.length !== 0) {
                        for (let i = 0; i < files.length; i++) {
                            let condition = false;

                            for (let j = 0; j < supportedFiles.length; j++) {
                                if ((new RegExp('\\' + supportedFiles[j] + '$')).test(files[i].name)) {
                                    condition = true;
                                    break;
                                }
                            }

                            if (!condition) {
                                reject(`Unsupported file: ${files[i].name}`);
                                return;
                            }
                        }
                    }

                    resolve(files);
              }
            });
    }
}
