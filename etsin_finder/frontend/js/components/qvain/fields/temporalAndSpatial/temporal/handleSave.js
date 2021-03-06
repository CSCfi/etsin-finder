import { temporalDateSchema } from '../../../utils/formValidation'

export default async (Store, Field) => {
  const { inEdit, create, setValidationError, addTemporal } = Field
  try {
    await temporalDateSchema.validate(inEdit, { strict: true })
  } catch (e) {
    setValidationError(e.message)
    return
  }
  addTemporal()
  create()
}
