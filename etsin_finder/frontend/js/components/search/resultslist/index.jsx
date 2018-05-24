import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ElasticQuery from '../../../stores/view/elasticquery'
import Loader from '../../general/loader'
import ListItem from './listItem'

class ResultsList extends Component {
  constructor(props) {
    super(props)

    this.renderList = this.renderList.bind(this)
  }

  renderList(lang) {
    const list = ElasticQuery.results.hits.map(
      single => (
        <ListItem
          key={single._id}
          catId={single._source.identifier}
          item={single._source}
          lang={lang}
        />
      ),
      this
    )
    return list
  }

  render() {
    const { currentLang } = this.props.Stores.Locale
    return (
      <div>
        <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
        {this.renderList(currentLang)}
      </div>
    )
  }
}

ResultsList.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(ResultsList))
