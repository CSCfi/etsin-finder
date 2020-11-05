import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { FAIRDATA_WEBSITE_URL } from '../../../../utils/constants'
import { useStores } from '../../utils/stores'

const Description = () => {
  const {
    Locale: { lang },
  } = useStores()
  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.QVAIN.FI : FAIRDATA_WEBSITE_URL.QVAIN.EN
  return (
    <>
      <Header>Qvain</Header>
      <Translate component={Brief} content="qvain.home.brief" />
      <Translate component="p" content="qvain.home.description" />
      <p>
        <Translate component="a" href={helpUrl} content="qvain.home.howTo" />
      </p>
    </>
  )
}

const Header = styled.h1`
  font-weight: bold;
  line-height: 1.2;
  font-size: 36px;
`

const Brief = styled.h5`
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 1rem;
`

export default observer(Description)
