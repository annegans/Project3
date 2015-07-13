class CommentsController <ApplicationController
 def create 
  comment = Comment.create(title: params['comment']['title'], text:params['comment']['text'], post_id: params['comment']['post_id'], user: current_user)
 
    render :json => comment
 end
end