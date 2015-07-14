$(function() {
  console.log('hello')
  var mediaDropzone;
  mediaDropzone = new Dropzone("#media-dropzone");
  return mediaDropzone.on("success", function(file, responseText) {
    var _this = this;
    console.log(file, responseText, responseText.avatar.url);
    var imageUrl = responseText.avatar.url
    var imageId = responseText.id
    var postId = responseText.post_id
    appendContent(imageUrl, imageId, postId);
    // ActionDispatch
  });
});

function appendContent(imageUrl, imageId, post_id){
  console.log(imageUrl, imageId, post_id, "2222")
  $("#media-contents").append('<div class="col-lg-4">' + 
    '<div class="thumbnail"><img src="' + imageUrl + '"/>' +
    '<div class="caption">' +
    '<input id="media_contents_" name="media_contents[]" value="' + imageId +'" type="checkbox">' + 
    '</div>' +
    '</div></div>');
}







// var appendContent = function(imageUrl, mediaId) {

// };
