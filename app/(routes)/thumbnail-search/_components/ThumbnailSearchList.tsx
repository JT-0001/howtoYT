import React from 'react'
import { VideoInfo } from '../page'
import VideoCard from './VideoCard'

type PROPS = {
  videoList: VideoInfo[] | undefined,
  SearchSimilerThumbnail: any
}

function ThumbnailSearchList({ videoList, SearchSimilerThumbnail }: PROPS) {

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {videoList && videoList.map((video, index) => (
          <div onClick={() => SearchSimilerThumbnail(video.thumbnail)}>
            <VideoCard videoInfo={video} key={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThumbnailSearchList