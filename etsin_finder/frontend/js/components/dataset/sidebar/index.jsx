import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import checkDataLang from '../../../utils/checkDataLang'
import checkNested from '../../../utils/checkNested'
import dateFormat from '../../../utils/dateFormat'
import ContentBox from '../../general/contentBox'
import SidebarItem from './sidebarItem'
import Identifier from '../identifier'
import Citation from './citation'
import Logo from './logo'
import ErrorBoundary from '../../general/errorBoundary'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    const dataCatalog = props.dataset.data_catalog
    const researchDataset = props.dataset.research_dataset

    // sidebar data
    this.state = {
      harvested: dataCatalog.catalog_json.harvested,
      catalog_publisher: checkNested(dataCatalog, 'catalog_json', 'publisher', 'name')
        ? dataCatalog.catalog_json.publisher.name
        : false,
      publisher: checkNested(researchDataset, 'publisher', 'name')
        ? researchDataset.publisher.name
        : false,
      logoAlt: dataCatalog.catalog_json.title,
      logo: dataCatalog.catalog_json.logo,
      pid: researchDataset.preferred_identifier,
      field: researchDataset.field_of_science,
      keyword: researchDataset.keyword,
      geographic_name: checkNested(researchDataset, 'spatial') ? researchDataset.spatial : false,
      temporal: checkNested(researchDataset, 'temporal') ? researchDataset.temporal : false,
      license: checkNested(researchDataset, 'access_rights', 'license')
        ? researchDataset.access_rights.license
        : false,
      access_rights: checkNested(researchDataset, 'access_rights', 'access_type', 'pref_label')
        ? researchDataset.access_rights.access_type.pref_label
        : false,
      isOutputOf: checkNested(researchDataset, 'is_output_of')
        ? researchDataset.is_output_of
        : false,
      curator: researchDataset.curator,
      related_entity: checkNested(researchDataset, 'related_entity')
        ? researchDataset.related_entity
        : false,
    }
  }

  dateSeparator(start, end) {
    return (
      (start || end) && (
        <p key={start}>
          <span>
            {start === end ? dateFormat(start) : `${dateFormat(start)} - ${dateFormat(end)}`}
          </span>
        </p>
      )
    )
  }

  render() {
    return (
      <SidebarContainer>
        <ErrorBoundary>
          <div className="separator">
            {this.state.logo && (
              <Logo alt={checkDataLang(this.state.logoAlt)} file={this.state.logo} />
            )}
            <SidebarItem component="div" trans="dataset.catalog_publisher">
              {this.state.catalog_publisher && checkDataLang(this.state.catalog_publisher)}
            </SidebarItem>
          </div>
          <div className="separator">
            <SidebarItem component="div" trans="dataset.identifier">
              <Identifier idn={this.state.pid} />
            </SidebarItem>
          </div>
          <div>
            {/* PROJECT */}
            <SidebarItem component="p" trans="dataset.project" hideEmpty="true">
              {this.state.isOutputOf && this.state.isOutputOf.map(item => checkDataLang(item.name))}
            </SidebarItem>
            {/* FIELD OF SCIENCE */}
            <SidebarItem
              component="div"
              trans="dataset.field_of_science"
              fallback="Field of Science"
              hideEmpty="true"
            >
              {this.state.field &&
                this.state.field.map(field => (
                  <p key={field.identifier}>{checkDataLang(field.pref_label)}</p>
                ))}
            </SidebarItem>
            {/* KEYWORDS */}
            <SidebarItem component="p" trans="dataset.keywords" hideEmpty="true">
              {this.state.keyword &&
                this.state.keyword.map((keyword, i) => (
                  <span className="keyword" key={keyword}>
                    {keyword}
                    {this.state.keyword.length !== i + 1 && ', '}
                  </span>
                ))}
            </SidebarItem>
            {/* SPATIAL COVERAGE */}
            <SidebarItem
              component="p"
              trans="dataset.spatial_coverage"
              fallback="Spatial Coverage"
              hideEmpty="true"
            >
              {/* disabled spatial coverage for now */}
              {console.log('geographic name', this.state.geographic_name)}
              {/* {this.state.geographic_name &&
                this.state.geographic_name.map(single => (
                  <span key={single.geographic_name}>{single.geographic_name}, </span>
                ))} */}
            </SidebarItem>
            {/* TEMPORAL COVERAGE */}
            <SidebarItem
              component="div"
              trans="dataset.temporal_coverage"
              fallback="Temporal Coverage"
              hideEmpty="true"
            >
              {this.state.temporal &&
                this.state.temporal.map(dates =>
                  this.dateSeparator(dates.start_date, dates.end_date)
                )}
            </SidebarItem>
            {/* LICENSE */}
            <SidebarItem component="div" trans="dataset.license" hideEmpty="true">
              {this.state.license &&
                this.state.license.map(rights => {
                  // If license URL is available, link license title
                  if (
                    rights.license &&
                    (rights.license.startsWith('http://') || rights.license.startsWith('https://'))
                  ) {
                    return (
                      <p key={rights.identifier}>
                        <a href={rights.license} target="_blank" rel="noopener noreferrer">
                          {checkDataLang(rights.title)}
                        </a>
                      </p>
                    )
                  }
                  return <p key={rights.identifier}>{checkDataLang(rights.title)}</p>
                })}
            </SidebarItem>

            <SidebarItem
              component="p"
              trans="dataset.access_rights"
              fallback="Access rights statement"
              hideEmpty="true"
            >
              {this.state.access_rights && checkDataLang(this.state.access_rights)}
            </SidebarItem>

            <SidebarItem component="p" trans="dataset.publisher" hideEmpty="true">
              {this.state.publisher && checkDataLang(this.state.publisher)}
            </SidebarItem>

            <SidebarItem component="p" trans="dataset.funder" hideEmpty="true">
              {this.state.isOutputOf &&
                this.state.isOutputOf.map(
                  output =>
                    checkNested(output, 'has_funding_agency') &&
                    output.has_funding_agency.map(agency => checkDataLang(agency.name))
                )}
            </SidebarItem>

            <SidebarItem component="p" trans="dataset.curator" hideEmpty="true">
              {this.state.curator &&
                this.state.curator.map((curators, i) => {
                  let curator = checkDataLang(curators.name)
                  if (curator === '') {
                    curator = curators.name
                  }
                  return (
                    /* eslint-disable react/no-array-index-key */
                    <span key={`${curator}-${i}`}>
                      {curator}
                      {/* add separator, but not on last */}
                      {this.state.curator.length !== i + 1 && ', '}
                    </span>
                    /* eslint-enable react/no-array-index-key */
                  )
                })}
            </SidebarItem>

            <SidebarItem component="p" trans="dataset.infrastructure" hideEmpty="true">
              {this.state.related_entity &&
                this.state.related_entity.map(entity => checkDataLang(entity.title))}
            </SidebarItem>

            <SidebarItem component="div" trans="dataset.citation" hideEmpty="false">
              {!this.state.harvested && <Citation />}
            </SidebarItem>
          </div>
        </ErrorBoundary>
      </SidebarContainer>
    )
  }
}

Sidebar.propTypes = {
  dataset: PropTypes.object.isRequired,
}

const SidebarContainer = styled(ContentBox)`
  p {
    font-size: 0.875em;
  }
  h4 {
    margin-bottom: 0;
  }
  > div {
    padding: 20px 0px;
    &:first-of-type {
      padding: 0 0 20px;
    }
  }
  .separator {
    &:after {
      content: '';
      display: block;
      height: 2px;
      background-color: ${props => props.theme.color.lightgray};
      position: relative;
      bottom: -20px;
      width: 200%;
      margin: 0 -100px;
    }
  }
`

export default inject('Stores')(observer(Sidebar))
