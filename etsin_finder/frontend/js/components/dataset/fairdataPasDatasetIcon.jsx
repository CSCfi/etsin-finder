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
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { DATA_CATALOG_IDENTIFIER } from '../../utils/constants'
import { withStores } from '../../utils/stores'

const FairdataPasDatasetIcon = props => {
  if (
    `${props.preservation_state}` > 0 &&
    `${props.data_catalog_identifier}` !== DATA_CATALOG_IDENTIFIER.PAS
  ) {
    return (
      <FairdataPasIconContainerEnteringPas>
        <FairdataPasIconLabel>
          <Translate content="dataset.enteringPas" />
        </FairdataPasIconLabel>
      </FairdataPasIconContainerEnteringPas>
    )
  }
  return (
    <FairdataPasIconContainerInPas>
      <Translate component={FairdataPasIconLabel} content="dataset.fairdataPas" />
    </FairdataPasIconContainerInPas>
  )
}

export default withStores(observer(FairdataPasDatasetIcon))
export const undecorated = FairdataPasDatasetIcon

const FairdataPasIconContainerInPas = styled.div`
  padding: 0.2em 0.9em;
  background-color: #b3efb0;
  border-radius: 1em;
  margin-right: 5px;
`

const FairdataPasIconContainerEnteringPas = styled.div`
  padding: 0.2em 0.9em;
  background-color: #efe4b0;
  border-radius: 1em;
  margin-right: 5px;
`

const FairdataPasIconLabel = styled.div`
  display: inline;
  white-space: nowrap;
`

FairdataPasDatasetIcon.defaultProps = {
  preservation_state: undefined,
  data_catalog_identifier: undefined,
}

FairdataPasDatasetIcon.propTypes = {
  preservation_state: PropTypes.number,
  data_catalog_identifier: PropTypes.string,
}
