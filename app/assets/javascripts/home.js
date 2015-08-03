//search form
function searchForm(){
 $('.search-form').css({
   'display': 'block'
 })
}

//coment form 
function commentForm(){
 var form = $(this).parent().find('.comment-form');
 form.css({
  'display': 'block'
  })
}


function createComment(e){  
  e.preventDefault(); 
  title = $('#comment_title', $(this)).val();
  text = $('#comment_text', $(this)).val();
  var urlSplit = window.location.pathname.split('/')
  var id = Number(urlSplit[2])
  console.log('createComment');
   $.ajax({
    method: 'post',
    url: '/comments',
    dataType: 'json',
    data: {
      comment:{title: title, text: text, post_id: id}
    }
   }).done(function(data){
    // $('[data-id=' + data.post_id + ']').append('<p>' + title + '</p>' )
   $('[data-id=' + data.post_id + ']').parent().next().find("#comments-scroll").find('h3').find('.ajax-comments').append('<p>' + title + '</p>' )

  $('#comment_title')[0].reset()
   })
}

// Favotites

function saveFavorite(e){
  e.preventDefault
  var image = $(this).parent().parent().find('img')
  var text = image.attr('src')
  var _this = $(this)
  $.ajax({
    method: 'post',
    url: '/favorites',
    dataType: 'json',
    data: {
      favorite:{text: text}
    }
  }).done(function(data){
    console.log('favo saved')

     _this.parent().parent().find('.image-style').find('.savedb').addClass('savedbshow')
    setTimeout(function(){ $('.savedb').removeClass('savedbshow'); },2000);
  })
}

function removeFavorite(e){
  console.log('favorites')
   e.preventDefault
   var favoriteId = $(this).closest('.favorite-box').data('id')
   _favorite = $(this)
   $.ajax({
    dataType: 'json',
    method: 'delete',
    url: '/favorites/' + favoriteId
  }).done(function(data){
   
    _favorite.closest('.favorite-box').remove()

  })

}




//create new like
function newLike(e){
  e.preventDefault(); 
  var postId2 = $(this).closest('.post').data('id')
  var _this = $(this)
  $.ajax({
     method: 'post',
     url: '/votes',
     dataType: 'json',
     data: {
      vote:{post_id: postId2}
    }
  }).done(function(data){
    console.log(data)
   console.log(_this)
    // _this.prev().find('.like-count-js').html(data);
    _this.prev().find('.like-count-js').html(data);
   _this.parent().parent().find('.image-style').find('.likedb').addClass('likedbshow')
    setTimeout(function(){ $('.likedb').removeClass('likedbshow'); },2000);
  })
  .fail(function(err) {
    console.log(err)
  })
}



//delete post
function deletePost(e){
  e.preventDefault()
  var postId =  $(this).data('id');
  console.log(postId);
  //Storing a reference to the delete button because the context of this changes
  _post = $(this);
  $.ajax({
    dataType: 'json',
    method: 'delete',
    url: '/posts/' + postId
  }).done(function(data){
    _post.closest('.your-posts').remove()
  })
}




//eventlisteners
$(function(){
  
  $('.fa-search').on('click', searchForm)
  $('.new_comment').on('submit', createComment)
  $('.like-js').on('click', newLike);
  $('body').on('click', '.delete-post', deletePost)
  $('body').on('click', '.save-post', saveFavorite)
  $(".favorite-remove").on('click', removeFavorite)
   


   // Dropdown toggle
  $('.dropdown-toggle').click(function(){
    $(this).next('.dropdown').toggle();
  });

  // ajax call for order
  $('#user_nav').on('click', '.votes-order', function(e){
    e.preventDefault();
    var sortTag = $(this).text();
    $.ajax({
      dataType: 'json',
      method: 'get',
      url: '/home/sort_by?tag=' + sortTag
    }).done(function(data){
      $('.post1').empty()
      debugger;
     $(data).each(function (index, value){
     console.log(value.title, value.votes_count)
     })

    })
  })

  //Check to see if the window is top if not then display button
    $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
        $('.scrollToTop').fadeIn();
      } else {
        $('.scrollToTop').fadeOut();
      }
    });
    
    //Click event to scroll to top
    $('.scrollToTop').click(function(){
      $('html, body').animate({scrollTop : 0},800);
      return false;
    });
})


