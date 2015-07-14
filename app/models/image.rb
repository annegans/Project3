class Image < ActiveRecord::Base
  belongs_to :post
  mount_uploader :avatar, AvatarUploader
end
