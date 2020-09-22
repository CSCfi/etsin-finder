{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import QvainLogo from './qvainLogo'
import Settings from '../../general/navigation/settings'
import Navi from '../../general/navigation'
import MobileNavi from '../../general/navigation/mobileNavi'
import { FAIRDATA_WEBSITE_URL } from '../../../utils/constants'
import Header, { NaviContainer, Right } from '../../general/header'
import { Qvain, QvainDatasets } from '../../../routes'

const QvainHeader = props => {
  const { original } = props.Stores.Qvain
  const { lang } = props.Stores.Locale

  const routes = [
    {
      loadableComponent: QvainDatasets,
      label: 'qvain.nav.home',
      path: '/',
      exact: true,
    },
    {
      loadableComponent: Qvain,
      label: original ? 'qvain.nav.editDataset' : 'qvain.nav.createDataset',
      path: '/dataset',
      exact: false,
    },
  ]

  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.QVAIN.FI : FAIRDATA_WEBSITE_URL.QVAIN.EN
  return (
    <Header>
      <QvainLogo />
      <NaviContainer aria-label="primary">
        <Navi routes={routes} />
      </NaviContainer>
      <Right>
        <Settings helpUrl={helpUrl} />
      </Right>
      <MobileNavi helpUrl={helpUrl} naviRoutes={routes} />
    </Header>
  )
}

QvainHeader.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(QvainHeader))