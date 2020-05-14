import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { inject, observer } from 'mobx-react'
import Label from './label'

class SelectedItems extends Component {
  generateComponents = () => {
    const { getter } = this.props
    const { lang } = this.props.Stores.Locale

    return getter.map((item) => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={`selected_${item.url}`}>
        <PaddedWord>{item.name[lang]}</PaddedWord>
        <FontAwesomeIcon onClick={() => this.removeFieldOfScience(item)} icon={faTimes} size="xs" />
      </Label>
    ))
  }

  render() {
    return <>{this.generateComponents()}</>
  }
}

SelectedItems.propTypes = {
  Stores: PropTypes.object.isRequired,
  getter: PropTypes.array.isRequired,
}

const PaddedWord = styled.span`
  padding-right: 10px;
`
export default inject('Stores')(observer(SelectedItems))
