class CommentsController <ApplicationController
 def create 
   Comment.create(title: params['comment']['title'], text:params['comment']['text'], post_id: params['comment']['post_id'], user: current_user)
    redirect_to root_path
 end
end