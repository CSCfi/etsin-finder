import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormContainer } from '../../../../general/modal/form'
import TabInput from '../../../../general/input/translationTabInputModal'
import TranslationTab from '../../../../general/input/translationTab'
import LocationInput from './locationInput'
import ModalReferenceInput from '../../../../general/modal/modalReferenceInput'
import { Outcome, Lifecycle } from '../../../../../../stores/view/qvain/qvain.provenances'
import Separator from '../../../../general/modal/modalSeparator'
import UsedEntityInput from './usedEntityInput'
import ActorsInput from './actorsInput'
import DurationPicker from '../../../../general/input/durationpicker'
import { useStores } from '../../../../utils/stores'

const Form = props => {
  const {
    Locale: { getMatchingLang },
  } = useStores()
  const { inEdit } = props.Field

  const translations = [inEdit.name, inEdit.description, inEdit.outcomeDescription]
  const [language, setLanguage] = useState(getMatchingLang(translations))

  return (
    <FormContainer>
      <TranslationTab language={language} setLanguage={setLanguage}>
        <TabInput {...props} datum="name" language={language} isRequired />
        <TabInput {...props} datum="description" language={language} />
        <TabInput {...props} datum="outcomeDescription" language={language} />
      </TranslationTab>
      <Separator />
      <DurationPicker {...props} datum="periodOfTime" language={language} id="provenance-period" />
      <LocationInput />
      <Separator />
      <ModalReferenceInput
        {...props}
        datum="outcome"
        metaxIdentifier="event_outcome"
        model={Outcome}
      />
      <Separator />
      <UsedEntityInput />
      <Separator />
      <ActorsInput {...props} datum="actors" />
      <Separator />
      <ModalReferenceInput
        {...props}
        datum="lifecycle"
        metaxIdentifier="lifecycle_event"
        model={Lifecycle}
      />
    </FormContainer>
  )
}

Form.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
}

export default Form
