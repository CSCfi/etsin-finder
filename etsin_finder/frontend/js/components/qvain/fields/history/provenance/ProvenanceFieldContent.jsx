import React from 'react'
import { observer } from 'mobx-react'
import FieldList from '../../../general/section/fieldList'
import FieldListAdd from '../../../general/section/fieldListAdd'
import handleSave from './handleSave'
import Form from './form'
import { useStores } from '../../../utils/stores'

const ProvenanceFieldContent = () => {
  const {
    Qvain: Store,
    Locale: { lang },
  } = useStores()

  const Field = Store.Provenances
  const translationsRoot = 'qvain.history.provenance'
  return (
    <>
      <FieldList Field={Field} lang={lang} translationsRoot={translationsRoot} />
      <FieldListAdd
        Store={Store}
        Field={Field}
        translationsRoot={translationsRoot}
        handleSave={() => handleSave(Field)}
        Form={Form}
      />
    </>
  )
}

export default observer(ProvenanceFieldContent)
