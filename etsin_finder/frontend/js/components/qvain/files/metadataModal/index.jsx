import React, { Component } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import axios from 'axios'

import { observable, action } from 'mobx'

import Modal from '../../../general/modal'
import getReferenceData from '../../utils/getReferenceData'
import { fileMetadataSchema } from '../../utils/formValidation'
import { Label, HelpField, Input } from '../../general/form'
import { DangerButton, TableButton } from '../../general/buttons'
import Response from '../response'

import { separatorOptions, delimiterOptions, encodingOptions, hasheaderOptions,
  getDefaultOptions, makeOption, findOption } from './options'
import { MetadataSelect, selectStylesNarrow, labelStyle } from './select'


const patchFileCharacteristics = (identifier, data) => axios.patch(`/api/files/file_characteristics/${identifier}`, data,
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

class MetadataModal extends Component {
  @observable
  formatFetchStatus = 'loading'

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    formatVersionsMap: {},
    formatOptions: [],
    response: null,
    fileChanged: false,
    confirmClose: false,
    criticalError: false,
    fileIdentifier: null,

    // PAS Metadata
    fileFormat: undefined,
    formatVersion: undefined,
    encoding: undefined,
    csvDelimiter: undefined,
    csvRecordSeparator: undefined,
    csvQuotingChar: undefined,
    csvHasHeader: undefined,
  }

  async componentDidMount() {
    this.initialize()
    await this.fetchformatVersions()
  }

  @action
  setFormatFetchStatus(value) {
    this.formatFetchStatus = value
  }

  getformatVersionOptions() {
    return (this.state.formatVersionsMap[this.state.fileFormat] || []).map(
      v => ({ value: v, label: v })
    )
  }

  setFileFormat = (formatOption) => {
    this.setState({
      fileFormat: formatOption.value,
      formatVersion: '',
      fileChanged: true
    })
  }

  setFormatVersion = (versionOption) => {
    this.setState({
      formatVersion: versionOption.value,
      fileChanged: true
    })
  }

  setEncoding = (encodingOption) => {
    this.setState({
      encoding: encodingOption.value,
      fileChanged: true
    })
  }

  setCsvDelimiter = (csvDelimiterOption) => {
    this.setState({
      csvDelimiter: csvDelimiterOption.value,
      fileChanged: true
    })
  }

  setCsvRecordSeparator = (csvRecordSeparatorOption) => {
    this.setState({
      csvRecordSeparator: csvRecordSeparatorOption.value,
      fileChanged: true
    })
  }

  setCsvHasHeader = (csvHasHeaderOption) => {
    this.setState({
      csvHasHeader: csvHasHeaderOption.value,
      fileChanged: true
    })
  }

  handleChangeCsvQuotingChar = (event) => {
    this.setState({
      csvQuotingChar: event.target.value,
      fileChanged: true
    })
  }

  requestClose = () => {
    if (this.state.loading) {
      return
    }

    if (!this.state.fileChanged) {
      this.close()
    } else {
      this.showConfirmClose()
    }
  }

  showConfirmClose = () => {
    this.setState({
      confirmClose: true
    })
  }

  hideConfirmClose = () => {
    this.setState({
      confirmClose: false
    })
  }

  clearError = () => {
    this.setState({
      response: null
    })
  }

  close = () => {
    this.props.Stores.Qvain.setMetadataModalFile(null)
  }

  validateMetadata = () => {
    fileMetadataSchema.validate(this.state)

    // Additional validation for formatVersion
    const versions = this.state.formatVersionsMap[this.state.fileFormat] || []

    if (versions.length === 0) {
      if (this.state.formatVersion) {
        throw new Error(translate('qvain.files.metadataModal.errors.formatVersionNotAllowed'))
      }
    } else if (!versions.includes(this.state.formatVersion)) {
      throw new Error(translate('qvain.files.metadataModal.errors.formatVersionRequired'))
    }
  }

  saveChanges = async () => {
    if (this.state.loading) {
      return
    }

    try {
      this.validateMetadata()
    } catch (error) {
      this.setState({
        response: {
          error: error.message
        }
      })
      return
    }

    try {
      this.setState({
        loading: true
      })

      const response = await patchFileCharacteristics(this.state.fileIdentifier, {
        file_format: this.state.fileFormat,
        format_version: this.state.formatVersion,
        encoding: this.state.encoding,
        csv_has_header: this.state.csvHasHeader,
        csv_delimiter: this.state.csvDelimiter,
        csv_record_separator: this.state.csvRecordSeparator,
        csv_quoting_char: this.state.csvQuotingChar
      })

      // Update file hierarchy with response data, close modal
      this.props.Stores.Qvain.updateFileMetadata(response.data)
      this.setState({
        fileChanged: false
      })
      this.close()
    } catch (err) {
      let error = ''
      if (err.response && err.response.data && err.response.data.detail) {
        error = err.response.data.detail
      } else if (err.response && err.response.data) {
        error = err.response.data
      } else {
        error = err.response.errorMessage
      }
      if (error.file_characteristics) {
        error = error.file_characteristics
      }
      if (typeof error === 'object') {
        error = JSON.stringify(error)
      }
      this.setState({
        response: {
          error
        }
      })
    } finally {
      this.setState({
        loading: false
      })
    }
  }

  componentWillReact = async () => {
    const file = this.props.Stores.Qvain.metadataModalFile || {}
    if (file.identifier !== this.state.fileIdentifier) {
      this.initialize()
      if (this.formatFetchStatus === 'error') {
        await this.fetchformatVersions()
      }
    }
  }

  async fetchformatVersions() {
    this.setFormatFetchStatus('loading')
    try {
      // Create a list of available versions for each supported file format.
      const resp = await getReferenceData('file_format_version')
      const fileFormatVersions = resp.data.hits.hits.map(v => v._source)

      // get array of available versions for each file format
      const formatVersionsMap = {}
      fileFormatVersions.forEach(formatVersion => {
        if (formatVersionsMap[formatVersion.input_file_format] === undefined) {
          formatVersionsMap[formatVersion.input_file_format] = []
        }
        if (formatVersion.output_format_version !== '') {
          formatVersionsMap[formatVersion.input_file_format].push(formatVersion.output_format_version)
        }
      })

      // use natural sort order for version numbers
      const sortArray = (arr => arr.sort(
        (a, b) => a.localeCompare(b, undefined, { numeric: true })
      ))
      Object.values(formatVersionsMap).forEach(versions => sortArray(versions))
      const formatOptions = Object.keys(formatVersionsMap)
      sortArray(formatOptions)

      this.setState({
        formatOptions: formatOptions.map(v => ({ value: v, label: v })),
        formatVersionsMap
      })

      this.setFormatFetchStatus('done')
    } catch (e) {
      this.setState({
        criticalError: true,
        response: {
          error: translate('qvain.files.metadataModal.errors.loadingFileFormats')
        }
      })

      this.setFormatFetchStatus('error')
    }
  }

  initialize() {
    const file = this.props.Stores.Qvain.metadataModalFile || {}
    const newState = {
      response: null,
      fileChanged: false,
      confirmClose: false,
      criticalError: false,
      fileIdentifier: file.identifier,
      fileFormat: file.fileFormat,
      formatVersion: file.formatVersion,
      encoding: file.encoding,
      csvDelimiter: file.csvDelimiter,
      csvRecordSeparator: file.csvRecordSeparator,
      csvQuotingChar: file.csvQuotingChar,
      csvHasHeader: file.csvHasHeader
    }

    // Replace null/undefined metadata with defaults
    const defaults = getDefaultOptions()
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        if (newState[key] == null) {
          newState[key] = defaults[key]
        }
      }
    }
    this.setState(newState)
  }

  render() {
    const { metadataModalFile } = this.props.Stores.Qvain

    return (
      <Modal
        contentLabel="metadatamodal"
        isOpen={!!metadataModalFile}
        onRequestClose={this.requestClose}
        customStyles={modalStyles}
      >
        <h2 style={{ marginBottom: 0 }}>Edit PAS Metadata</h2>
        <Translate content="qvain.files.metadataModal.help" component={HelpField} />

        <MetadataSelect
          inputId="pas_file_format"
          options={this.state.formatOptions}
          value={makeOption(this.state.fileFormat)}
          onChange={this.setFileFormat}
          isLoading={this.state.formatVersionsMap.length === 0}
          field="fileFormat"
        />

        <MetadataSelect
          inputId="pas_format_version"
          options={this.getformatVersionOptions()}
          value={makeOption(this.state.formatVersion)}
          onChange={this.setFormatVersion}
          isLoading={this.state.formatVersionsMap.length === 0}
          isSearchable={false}
          field="formatVersion"
        />

        <MetadataSelect
          inputId="pas_file_encoding"
          options={encodingOptions}
          value={findOption(this.state.encoding, encodingOptions)}
          onChange={this.setEncoding}
          field="encoding"
        />

        <h3 style={{ marginBottom: 0, marginTop: '0.3rem' }}>CSV Options</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '26em' }}>
          <MetadataSelect
            inputId="pas_csv_delimiter"
            options={delimiterOptions}
            value={findOption(this.state.csvDelimiter, delimiterOptions)}
            onChange={this.setCsvDelimiter}
            styles={selectStylesNarrow}
            field="csvDelimiter"
          />

          <MetadataSelect
            inputId="pas_csv_record_separator"
            options={separatorOptions}
            value={findOption(this.state.csvRecordSeparator, separatorOptions)}
            onChange={this.setCsvRecordSeparator}
            styles={selectStylesNarrow}
            field="csvRecordSeparator"
          />

          <Label
            htmlFor="pas_csv_quoting_char"
            style={labelStyle}
          >{ translate('qvain.files.metadataModal.fields.csvQuotingChar') }
            <div style={selectStylesNarrow.control()}>
              <Input
                id="pas_csv_quoting_char"
                placeholder="Type a character"
                type="text"
                value={this.state.csvQuotingChar}
                onChange={this.handleChangeCsvQuotingChar}
              />
            </div>
          </Label>

          <MetadataSelect
            inputId="pas_csv_has_header"
            options={hasheaderOptions}
            value={findOption(this.state.csvHasHeader, hasheaderOptions)}
            onChange={this.setCsvHasHeader}
            styles={selectStylesNarrow}
            field="csvHasHeader"
          />
        </div>

        <TableButton disabled={this.state.loading} onClick={this.requestClose}>
          <Translate content={'qvain.files.metadataModal.buttons.close'} />
        </TableButton>
        <DangerButton disabled={this.state.loading} onClick={this.saveChanges}>
          <Translate content={'qvain.files.metadataModal.buttons.save'} />
        </DangerButton>

        { this.state.confirmClose && (
          <ResponseOverlay>
            <div style={{ width: '100%' }}>
              <Translate content={'qvain.files.metadataModal.warning'} component="p" />
              <AutoWidthTableButton disabled={this.state.loading} onClick={this.hideConfirmClose}>
                <Translate content={'qvain.files.metadataModal.buttons.cancelClose'} />
              </AutoWidthTableButton>
              <DangerButton disabled={this.state.loading} onClick={this.close}>
                <Translate content={'qvain.files.metadataModal.buttons.confirmClose'} />
              </DangerButton>
            </div>
          </ResponseOverlay>
        )}

        {(this.state.loading || this.state.response) && (
          <ResponseOverlay>
            <div style={{ width: '100%' }}>
              <Response response={this.state.response} />
              { !this.state.loading && (
                this.state.criticalError ? (
                  <AutoWidthTableButton onClick={this.close}>
                    <Translate content={'qvain.files.metadataModal.buttons.close'} />
                  </AutoWidthTableButton>
                ) : (
                  <AutoWidthTableButton onClick={this.clearError}>
                    <Translate content={'qvain.files.metadataModal.buttons.hideError'} />
                  </AutoWidthTableButton>
                )
              )}
            </div>
          </ResponseOverlay>
        )}
      </Modal>
    )
  }
}


export const modalStyles = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minWidth: '32vw',
    maxWidth: '30em',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
  },
  overlay: {
    zIndex: '100',
  }
}

const ResponseOverlay = styled.div`
  display: flex;
  position: absolute;
  background: rgba(255,255,255,0.95);
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 2em;
`

export const AutoWidthTableButton = styled(TableButton)`
  width: auto;
`;

export default inject('Stores')(observer(MetadataModal))
