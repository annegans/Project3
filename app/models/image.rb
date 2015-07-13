class Image < ActiveRecord::Base
  belongs_to :post
  # belongs_to :user, through: :post
  # mount_uploader :avatar, AvatarUploader
end
