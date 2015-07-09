class PostsController < ApplicationController
  def create 
    Post.create(title: params['post']['title'], user: current_user)
    redirect_to account_path 
  end

  # @post = current_user.posts.build(post_params)
  #   if @post.save
  #     # to handle multiple images upload on create
  #     if params[:images]
  #        params[:images].each { |image|
  #        @post.images.create(image: image)
  #       }
  #     end
  #     flash[:notice] = "Your album has been created."
  #     redirect_to @post
  #   else 
  #     flash[:alert] = "Something went wrong."
  #     render :new
  #   end

  # end

  def destroy 
    Post.find(params[:id]).destroy
    redirect_to account_path 
  end

  # private
  # def post_params
  #   params.require(:post).permit(:title, :user_id, images: [:avatar])
  # end

end


