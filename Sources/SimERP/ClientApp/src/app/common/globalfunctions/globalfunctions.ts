export class Globalfunctions {
  static openInNewTab(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  static debugBase64(base64URL) {
    const win = window.open();
    win.document.title = 'SIM ERP';
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; ' +
      'width:100%; height:100%;" allowfullscreen></iframe>');
  }

  static checkIsImageFile(file: File) {
    const mimeType = file.type;
    return mimeType.match(/image\/*/) != null;
  }

  static checkIsImageByExtension(data) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(data)) {
      return false;
    }
    return true;
  }

}
