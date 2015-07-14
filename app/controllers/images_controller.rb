class ImagesController < ApplicationController
  def new
    @image = Image.new
    @post = Post.find(params[:post_id])
  end

  def create
    @image = Image.new(avatar: params[:file])
    @image.post_id = params[:post_id]
    if @image.save!
      respond_to do |format|
        format.json{ render :json => @image }
      end
    end
  end
end
