import axios from 'axios'
import config from '../../settings'

export default {
  getSignedURL (file, userId, projectId) {
    let endpoint = config.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
    let payload = {
      fileName: file.name,
      fullPath: file.fullPath || file.name,
      contentType: file.type,
      UserID: userId,
      ProjectID: projectId
    }
    return axios.post(endpoint, payload)
      .then((res) => {
        if (res.data.signed_url) {
          return Promise.resolve(res.data.signed_url)
        } else {
          return Promise.reject('/')
        }
      })
      .catch((err) => {
        console.error(err)
        return Promise.reject('/')
      })
  }
}
