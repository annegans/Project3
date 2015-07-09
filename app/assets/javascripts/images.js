$(function() {
  var mediaDropzone;
  mediaDropzone = new Dropzone("#media-dropzone");
  return mediaDropzone.on("success", function(file, responseText) {
    console.log(file, responseText);
    var imageUrl;
    imageUrl = responseText.file_name.url;
  });
});

var appendContent = function(imageUrl, mediaId) {

};