const downloadFile = (fileData: Blob | MediaSource, fileName: string) => {
  const url = window.URL.createObjectURL(fileData);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

export default downloadFile;