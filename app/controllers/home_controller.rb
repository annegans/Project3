class HomeController <ApplicationController
  def index
   
    # @posts = Post.all
    # @posts = Post.sort_by(params[:order]).paginate(page: params[:page], per_page: 20)

    @comment = Comment.new
    @images = Image.all
    @votes = Vote.all 
    @vote = Vote.new
    users = User.all

 
    if params[:search]
      @posts = Post.search(params[:search]).order("created_at DESC")
    else
      @posts = Post.sort_by(params[:order]).paginate(page: params[:page], per_page: 20)
    end  
  end
end
