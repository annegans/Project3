class PostsController < ApplicationController
  def create 
    Post.create(title: params['post']['title'], user: current_user)
    redirect_to account_path 
  end
end
