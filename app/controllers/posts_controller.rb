class PostsController < ApplicationController


  def create 
    post = Post.create(title: params['post']['title'], user: current_user)
    redirect_to  new_post_image_path(post.id)
  end

  def show
    @post = Post.find params[:id]
    # @post = Post.where(post_id: )
    # @images = Image.where(post_id: params[:id])
    @comment = Comment.new
  end

  def destroy 
    @post = Post.find(params[:id]).destroy
    
    respond_to do |format|
      format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

#function not working sort_by ajax
  # def sort_by
  #   sort = Post.order("votes_count desc")
  #   binding.pry
  #   render json: sort
  # end

#can remove 
  # private
  # def post_params
  #   params.require(:post).permit(:title, :user_id, images: [:avatar])
  # end

end


