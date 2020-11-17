import React, { useState, useEffect, Fragment } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import Card from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { LabelLarge } from '../../../general/modal/form'
import {
  DatePicker,
  handleDatePickerChange,
  getDateFormatLocale,
} from '../../../general/input/datepicker'
import Tooltip from '../../../../general/tooltipHover'
import { useStores } from '../../../utils/stores'

const IssuedDateField = () => {
  const {
    Qvain: {
      original,
      useDoi,
      readonly,
      IssuedDate: { value: issuedDate, set: setIssuedDate, Schema },
    },
    Locale: { lang },
  } = useStores()
  const [error, setError] = useState('')

  useEffect(() => {
    Schema.validate(issuedDate)
      .then(() => {
        setError('')
      })
      .catch(err => {
        setError(err.errors)
      })
  }, [issuedDate, Schema])

  const publishedWithDoi = !!(useDoi && original)

  return (
    <Card bottomContent>
      <>
        <LabelLarge htmlFor="issuedDateInput">
          <Tooltip
            title={translate('qvain.description.fieldHelpTexts.requiredToPublish', {
              locale: lang,
            })}
            position="right"
          >
            <Translate content="qvain.description.issuedDate.title" /> *
          </Tooltip>
        </LabelLarge>
        <Translate component="p" content="qvain.description.issuedDate.infoText" />
        <DatePicker
          strictParsing
          selected={issuedDate ? new Date(issuedDate) : new Date()}
          onChangeRaw={e => e && handleDatePickerChange(e.target.value, setIssuedDate)}
          onChange={date => date && handleDatePickerChange(date.toISOString(), setIssuedDate)}
          locale={lang}
          placeholderText={translate('qvain.description.issuedDate.placeholder')}
          dateFormat={getDateFormatLocale(lang)}
          disabled={readonly || publishedWithDoi}
        />
        <Fragment>{error && <ValidationError>{error}</ValidationError>}</Fragment>
      </>
    </Card>
  )
}

export default observer(IssuedDateField)
