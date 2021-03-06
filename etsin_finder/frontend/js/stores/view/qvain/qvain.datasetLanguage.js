import { action, makeObservable } from 'mobx'

import ReferenceField from './qvain.referenceField'

class DatasetLanguages extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    if (dataset.language !== undefined) {
      this.storage = dataset.language.map(element => this.Model(element.title, element.identifier))
    }
  }

  Model = (name, url) => ({
    name,
    url,
  })
}

export default DatasetLanguages
