import React from 'react'
import { TouchableOpacity } from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'
import SecureWatermarkedImage from './SecureWatermarkedImage'

const GalleryItem = ({ item, index, openImage, galleryStyles }) => {

  const player = useVideoPlayer(item.url, p => {
    p.shouldPlay = false
  })

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        item.type === 'image' ? openImage(index) : null
      }
      style={galleryStyles.mediaWrapper}
    >
      {item.type === 'image' ? (
        <SecureWatermarkedImage
          source={{ uri: item.url }}
          style={galleryStyles.media}
          watermarkSource={require('../assets/images/filigrane.png')}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <VideoView
          player={player}
          style={galleryStyles.media}
          allowsFullscreen
          allowsPictureInPicture
        />
      )}
    </TouchableOpacity>
  )
}

export default GalleryItem
