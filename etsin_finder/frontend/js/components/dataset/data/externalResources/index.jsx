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
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import buildColumns from '../../../../utils/buildColumns'
import { useStores } from '../../../../stores/stores'
import { Header, HeaderTitle, HeaderStats, HeaderButton } from '../common/dataHeader'
import ResourceItem from './resourceItem'

const ExternalResources = () => {
  const {
    DatasetQuery: { results },
  } = useStores()
  if (!results) {
    return null
  }

  const remote = results.research_dataset.remote_resources
  if (!remote) {
    return null
  }

  const totalCount = remote.length
  const accessUrls = new Set(remote.map(resource => resource.access_url?.identifier).filter(v => v))
  const hasAccess = accessUrls.size > 0
  const hasCommonAccess = accessUrls.size === 1
  const showAccess = hasAccess && !hasCommonAccess
  const hasDownload = !!remote.find(resource => resource.download_url?.identifier)

  return (
    <DataTable>
      <Header>
        <Translate component={HeaderTitle} content="dataset.dl.remote" />
        <HeaderStats>
          <Translate content="dataset.dl.objectCount" with={{ count: totalCount }} />
        </HeaderStats>

        {hasCommonAccess && (
          <Translate
            component={HeaderButton}
            link
            href={Array.from(accessUrls)[0]}
            icon={faExternalLinkAlt}
            invert
            color="darkgray"
          >
            <Translate content="dataset.dl.commonSource" />
            <Translate className="sr-only" content="dataset.dl.file_types.both" />
          </Translate>
        )}
      </Header>

      <Grid showAccess={showAccess} hasDownload={hasDownload}>
        {remote.map(resource => (
          <ResourceItem
            key={`resource-${resource.identifier}-${resource.title}`}
            resource={resource}
            hideAccess={!showAccess}
            noButtons={!showAccess && !hasDownload}
          />
        ))}
      </Grid>
    </DataTable>
  )
}

const gridColumns = ({ showAccess, hasDownload, mobile }) => {
  const columns = [['name', '1fr']]
  if (!mobile) {
    columns.push(['category', 'minmax(max-content, 0.75fr)'])
  }
  if (showAccess) {
    columns.push(['access', '5.5rem'])
  }
  if (hasDownload) {
    columns.push(['download', '7rem'])
  }
  return buildColumns(columns)
}

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: ${p => gridColumns({ ...p, mobile: false })};
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: ${p => gridColumns({ ...p, mobile: true })};
  }
  grid-auto-rows: 1.5rem;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`

const DataTable = styled.div`
  margin-top: 1em;
`

export default observer(ExternalResources)
