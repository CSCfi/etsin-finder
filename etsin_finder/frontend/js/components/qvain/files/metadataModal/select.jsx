import React from 'react'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import Select from 'react-select'
import { Label } from '../../general/form'

export const MetadataSelect = (props) => {
  const noOptions = !props.options || props.options.length === 0
  return (
    <Label
      htmlFor={props.inputId}
      style={labelStyle}
    >{props.children || translate(`qvain.files.metadataModal.fields.${props.field}`)}
      <Select
        styles={!props.selectStyles && selectStyles}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
        name={props.inputId}
        isDisabled={noOptions}
        placeholder={noOptions ? 'No options available' : props.placeholder || 'Select an option'}
        {...props}
      />
    </Label>
  )
}

MetadataSelect.propTypes = {
  ...Select.propTypes,
  selectStyles: PropTypes.object,
  field: PropTypes.string
}


MetadataSelect.defaultProps = {
  selectStyles: null,
  field: null,
}

const selectStyles = {
  control: (provided) => ({
      ...provided,
  }),
  option: (provided) => ({
    ...provided,
    padding: '2px 8px',
    borderBottom: '1px solid #eee'
}),
}

export const selectStylesNarrow = {
  container: () => ({
    minWidth: '10em',
  }),
  control: (provided) => ({
      ...provided,
      minWidth: '10em',
      flexGrow: 1,
      marginBottom: 0,
  }),
  option: (provided) => ({
    ...provided,
    padding: '2px 8px',
    borderBottom: '1px solid #eee'
}),
}

export const labelStyle = {
  flexGrow: 1,
  flexBasis: '10em',
  marginTop: '0.2rem'
}

export default MetadataSelect
