import { observable, action, makeObservable, runInAction } from 'mobx'
import axios from 'axios'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../utils/constants'

const getErrorText = err => (err.response && err.response.data) || err.message

class Packages {
  // Download API package handling

  constructor(Env) {
    this.Env = Env
    makeObservable(this)
  }

  initialPollInterval = 1.5e3

  pollInterval = this.initialPollInterval

  pollTimeout = null

  @observable loadingDataset = false

  @observable error = null

  @observable datasetIdentifier = null

  @observable packages = {}

  @action clearPackages() {
    this.packages = {}
    this.error = null
  }

  @action reset() {
    this.datasetIdentifier = null
    this.clearPackages()
    this.setPollInterval(1.5e3)
    this.clearPollTimeout()
  }

  setPollInterval(interval) {
    this.initialPollInterval = interval
    this.pollInterval = interval
  }

  get(path) {
    return this.packages[path]
  }

  @action clearPollTimeout() {
    if (this.pollTimeout !== null) {
      window.clearTimeout(this.pollTimeout)
      this.pollTimeout = null
    }
  }

  @action setPollTimeout(func) {
    this.clearPollTimeout()
    this.pollTimeout = window.setTimeout(func, this.pollInterval)
  }

  @action schedulePoll() {
    // Poll status periodically if there are pending packages
    if (Object.values(this.packages).some(pack => pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING)) {
      this.setPollTimeout(
        async () => {
          await this.fetch(this.datasetIdentifier)
        })
      runInAction(() => {
        const maxInterval = 10e3
        this.pollInterval = Math.min(this.pollInterval * 2, maxInterval)
      })
    } else {
      this.pollInterval = this.initialPollInterval
      this.clearPollTimeout()
    }
  }

  @action updatePackage(path, pack) {
    if (pack.scope && pack.scope.length !== 1) {
      return
    }
    this.packages[path] = pack
  }

  @action updatePartials(partial) {
    if (!partial) {
      return
    }
    partial.forEach(pack => this.updatePackage(pack.scope[0], pack))
  }

  createPackage = async (params) => {
    try {
      const resp = await axios.post('/api/v2/dl/requests', params)
      const { partial, ...full } = resp.data
      if (partial) {
        this.updatePartials(partial)
      }
      if (full && full.status) {
        this.updatePackage('/', full)
      }
    } catch (err) {
      console.error(err)
      this.setError(getErrorText(err))
    }
    this.schedulePoll()
  }

  createPackageFromFolder = async (path) => {
    if (path === '/') {
      return this.createPackage({
        cr_id: this.datasetIdentifier
      })
    }

    return this.createPackage({
      cr_id: this.datasetIdentifier,
      scope: [path]
    })
  }

  @action setLoadingDataset(val) {
    this.loadingDataset = val
  }

  @action setError(msg) {
    this.error = msg
  }

  async fetch(datasetIdentifier) {
    try {
      // Fetch list of available downloadable packages
      const { downloadApiV2 } = this.Env
      if (!downloadApiV2) {
        return
      }

      runInAction(() => {
        if (this.datasetIdentifier !== datasetIdentifier) {
          this.clearPackages()
          this.setLoadingDataset(true)
        }
        this.datasetIdentifier = datasetIdentifier
      })

      let response
      try {
        const url = `/api/v2/dl/requests?cr_id=${datasetIdentifier}`
        response = await axios.get(url)
      } catch (err) {
        this.clearPackages()
        if (!(err.response && err.response.status === 404)) {
          console.error(err)
          this.setError(getErrorText(err))
        }
        return
      }

      const { partial, ...full } = response.data
      runInAction(() => {
        if (Object.keys(full).length > 0) {
          this.packages['/'] = full
        }
        this.updatePartials(partial)
      })
    } finally {
      this.schedulePoll()
      this.setLoadingDataset(false)
    }
  }
}

export default Packages