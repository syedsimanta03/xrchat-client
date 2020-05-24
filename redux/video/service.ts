import { Dispatch } from 'redux'
import {
  videosFetchedSuccess,
  videosFetchedError,
  // eslint-disable-next-line no-unused-vars
  PublicVideo,
  fileUploadSuccess
} from './actions'
import { client } from '../feathers'
import axios from 'axios'
import { apiUrl } from '../service.common'

export function fetchPublicVideos (pageOffset = 0) {
  return (dispatch: Dispatch) => {
    // loads next pages videos +1
    // doesn't work with a lower number
    // must load next page and at least 1 video of page after that
    // for grid arrows to show, and for videos to show on click arrow.
    const nVideosToLoad = 31
    client.service('static-resource').find({ query: { $limit: nVideosToLoad, $skip: nVideosToLoad * pageOffset, mimeType: 'application/dash+xml' } })
      .then((res: any) => {
        for (const video of res.data) {
          video.metadata = JSON.parse(video.metadata)
        }
        const videos = res.data as PublicVideo[]
        console.log('fetched', videos.length, 'videos.')
        return dispatch(videosFetchedSuccess(videos))
      })
      .catch(() => dispatch(videosFetchedError('Failed to fetch videos')))
  }
}
