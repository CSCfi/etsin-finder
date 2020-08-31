import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Label } from '../../../general/form'
import { ActorInput, ActorError } from '../../common'
import {
  organizationNameSchema,
  organizationEmailSchema,
  organizationIdentifierSchema,
} from '../../../utils/formValidation'

const schemas = {
  name: organizationNameSchema,
  email: organizationEmailSchema,
  identifier: organizationIdentifierSchema,
}

export class OrgFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    updateOrganization: PropTypes.func.isRequired,
  }

  state = {
    nameError: undefined,
    emailError: undefined,
    identifierError: undefined,
  }

  resetErrorMessages = () => {
    this.setState({
      nameError: undefined,
      identifierError: undefined,
    })
  }

  handleOnBlur = (propTag, lang = undefined) => {
    const organization = this.props.organization
    const value = lang ? organization[propTag][lang] : organization[propTag]
    const validator = schemas[propTag]
    const onError = err => this.setState({ [`${propTag}Error`]: err })
    validator
      .validate(value)
      .then(() => onError(undefined))
      .catch(err => onError(err.errors))
  }

  handleUpdateName = (name, lang) => {
    this.props.updateOrganization({ name: { ...this.props.organization.name, [lang]: name } })
  }

  handleUpdateEmail = email => {
    this.props.updateOrganization({ email })
  }

  handleUpdateIdentifier = identifier => {
    this.props.updateOrganization({ identifier })
  }

  getNameLang = () => {
    // Get organization name based on which translations exist, with the following priority:
    // - current language
    // - languages in the order of Locale.languages
    // - first language in the name object
    // - if no translations exist, create new translation in the current language
    const { lang: preferredLang } = this.props.Stores.Locale
    const { organization } = this.props
    if (organization.name[preferredLang] != null) {
      return preferredLang
    }

    const { languages } = this.props.Stores.Locale
    for (const lang of languages) {
      if (organization.name[lang] != null) {
        return lang
      }
    }

    if (Object.keys(organization.name).length > 0) {
      return Object.keys(organization.name)
    }

    return preferredLang
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { nameError, emailError, identifierError } = this.state
    const { organization } = this.props

    const lang = this.getNameLang()

    return (
      <FormContainer>
        <Label htmlFor="nameField">
          <Translate content="qvain.actors.add.organization.labels.name" /> *
        </Label>
        <Translate
          component={ActorInput}
          type="text"
          id="nameField"
          autoFocus
          attributes={{ placeholder: 'qvain.actors.add.name.placeholder.organization' }}
          disabled={readonly}
          value={organization.name[lang] || ''}
          onChange={event => this.handleUpdateName(event.target.value, lang)}
          onBlur={() => this.handleOnBlur('name', lang)}
        />
        {nameError && <ActorError>{nameError}</ActorError>}

        <Label htmlFor="emailField">
          <Translate content="qvain.actors.add.organization.labels.email" />
        </Label>
        <Translate
          component={ActorInput}
          type="text"
          id="emailField"
          attributes={{ placeholder: 'qvain.actors.add.email.placeholder' }}
          disabled={readonly}
          value={organization.email}
          onChange={event => this.handleUpdateEmail(event.target.value)}
          onBlur={() => this.handleOnBlur('email')}
        />
        {emailError && <ActorError>{emailError}</ActorError>}

        <Label htmlFor="identifierField">
          <Translate content="qvain.actors.add.organization.labels.identifier" />
        </Label>
        <Translate
          id="identifierField"
          component={ActorInput}
          type="text"
          disabled={readonly}
          attributes={{ placeholder: 'qvain.actors.add.identifier.placeholder' }}
          onChange={event => this.handleUpdateIdentifier(event.target.value)}
          value={organization.identifier}
          onBlur={() => this.handleOnBlur('identifier')}
        />
        {identifierError && <ActorError>{identifierError}</ActorError>}
      </FormContainer>
    )
  }
}

const FormContainer = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`

export default inject('Stores')(observer(OrgFormBase))
