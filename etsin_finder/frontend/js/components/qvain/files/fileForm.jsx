import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  SaveButton,
  CancelButton
} from '../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../general/form'
import { Container } from '../general/card'
import { getLocalizedOptions } from '../utils/getReferenceData';

class FileForm extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    title: this.props.Stores.Qvain.fileInEdit.file_characteristics.title,
    description: this.props.Stores.Qvain.fileInEdit.file_characteristics.description
  }

  componentDidMount = () => {
    getLocalizedOptions('file_type').then(translations => {
      this.setState({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi
      })
    })
    getLocalizedOptions('use_category').then(translations => {
      this.setState({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi
      })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.setInEdit(undefined)
  }

  handleSave = (event) => {
    event.preventDefault()
    const fileCharacteristics = this.props.Stores.Qvain.fileInEdit.file_characteristics
    fileCharacteristics.title = this.state.title
    fileCharacteristics.description = this.state.description
  }

  render() {
    return (
      <div>
        <FileContainer>
          <div className="file-form">
            <Label><Translate content="qvain.files.selected.form.title.label" /> *</Label>
            <Translate
              component={Input}
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
              attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
            />
            <Label><Translate content="qvain.files.selected.form.description.label" /> *</Label>
            <Translate
              component={Textarea}
              value={this.state.description}
              onChange={(event) => this.setState({ description: event.target.value })}
              attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
            />
            <Label><Translate content="qvain.files.selected.form.use.label" /> *</Label>
            <Translate
              component={CustomSelect}
              options={
                this.props.Stores.Locale.lang === 'en'
                ? this.state.useCategoriesEn
                : this.state.useCategoriesFi
              }
              attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.fileType.label"
            />
            <Translate
              component={CustomSelect}
              options={
                this.props.Stores.Locale.lang === 'en'
                ? this.state.fileTypesEn
                : this.state.fileTypesFi
              }
              attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
            />
            <Translate
              component={Label}
              style={{ textTransform: 'uppercase' }}
              content="qvain.files.selected.form.identifier.label"
            />
            <p>123476543234567876</p>
            <Translate component={CancelButton} onClick={this.handleCancel} content="qvain.common.cancel" />
            <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
          </div>
        </FileContainer>
      </div>
    )
  }
}

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

export default inject('Stores')(observer(FileForm))
