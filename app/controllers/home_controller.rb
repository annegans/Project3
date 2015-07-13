class HomeController <ApplicationController
  def index
    @posts = Post.all
    @comment = Comment.new
    @images = Image.all
    @votes = Vote.all 
    @vote = Vote.new
    users = User.all

  # search box
    if params[:search]
      @posts = Post.search(params[:search]).order("created_at DESC")
    else
      @posts = Post.all.order('created_at DESC')
    end
  # ajax request populate page
    respond_to do |format|
      format.html 
      format.json { render json: { posts: @posts, user: users, votes: @votes}
      }
    end
  end

 
end
