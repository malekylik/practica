export default class Dicom {
    constructor(files) {
        if (!files && (Array.isArray(files) || !(files instanceof File) || !(files instanceof FileList))) {
            throw new Error('Wrong file type in the Dicom constructor');
        }

        this.files = Array.from(files);
        this.filesUrl = {};
    }

    getUrl(file) {
        if (file instanceof File) {
            if (!(~(this.files.find(_file => _file === file)))) {
                return null;
            }

            if (this.filesUrl[file.name]) {
                return this.filesUrl[file.name];
            }

            return this.filesUrl[file.name] = URL.createObjectURL(file);
        }

        if (typeof file === 'number') {
            const _file = this.files[file];

            if (!_file) {
                return null;
            }

            if (this.filesUrl[_file.name]) {
                return this.filesUrl[file.name];
            }

            return this.filesUrl[_file.name] = URL.createObjectURL(_file);
        }

        if (typeof file === 'string') {
            const _file = this.files.find(({ name }) => name === file);

            if (!_file) {
                return null;
            }

            if (this.filesUrl[_file.name]) {
                return this.filesUrl[file.name];
            }

            return this.filesUrl[_file.name] = URL.createObjectURL(_file);
        }


        return null;
    }

    getUrls() {
        return this.files.map(file => this.getUrl(file));
    }

    getUrlsWithFileName() {
        return this.files.reduce((filesUrl, file) => {
            const url = this.getUrl(file);
            filesUrl[file.name] = url;

            return filesUrl;
        }, {});
    }
}
