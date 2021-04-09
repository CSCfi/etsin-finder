import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'
import { otherIdentifierSchema } from '../../../components/qvain/utils/formValidation'

class OtherIdentifiers extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    this.storage = dataset.other_identifier ? dataset.other_identifier.map(oid => oid.notation) : []
  }

  @action validateStr = () => {
    const { itemStr, storage, setValidationError } = this
    if (itemStr) {
      try {
        otherIdentifierSchema.validateSync(itemStr)
      } catch (err) {
        setValidationError(err.errors)
        return false
      }

      if (!storage.includes(itemStr)) {
        return true
      }

      const message = 'qvain.description.otherIdentifiers.alreadyAdded'
      setValidationError(message)
      return false
    }
    return true
  }

  @action cleanupBeforeBackend = () => {
    const { validateStr, addItemStr } = this
    if (!validateStr()) {
      return false
    }
    addItemStr()
    return true
  }
}

export default OtherIdentifiers
