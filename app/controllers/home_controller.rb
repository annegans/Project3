class HomeController <ApplicationController
  def index
   
    @posts = Post.all.order(title: :desc)
  

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
  end
end
