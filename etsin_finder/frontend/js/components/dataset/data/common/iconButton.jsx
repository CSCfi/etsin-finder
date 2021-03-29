import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import TooltipHover from '../../../general/tooltipHover'
import Button, { InvertedButton, Link, InvertedLink } from '../../../general/button'

const IconButton = ({
  icon,
  spin,
  link,
  href,
  children,
  invert,
  tooltip,
  fontSize,
  Wrapper,
  flexGrow,
  ...props
}) => {
  let as = null
  if (link) {
    as = invert ? InvertedLink : Link
  } else if (invert) {
    as = InvertedButton
  }

  return (
    <Wrapper>
      <Translate
        title={tooltip}
        component={TooltipHover}
        showOnHover={false}
        showOnClick={!!tooltip}
        flexGrow={flexGrow}
      >
        <StyledIconButton fill="white" as={as} href={href} {...props}>
          <StyledIconButtonIcon icon={icon} spin={spin} fixedWidth />
          <IconButtonText fontSize={fontSize}>{children}</IconButtonText>
        </StyledIconButton>
      </Translate>
    </Wrapper>
  )
}

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.object.isRequired,
  spin: PropTypes.bool,
  invert: PropTypes.bool,
  link: PropTypes.bool,
  href: PropTypes.string,
  tooltip: PropTypes.string,
  fontSize: PropTypes.string,
  Wrapper: PropTypes.elementType,
  flexGrow: PropTypes.number,
}

IconButton.defaultProps = {
  spin: false,
  invert: false,
  link: false,
  href: undefined,
  tooltip: null,
  fontSize: null,
  Wrapper: React.Fragment,
  flexGrow: 0,
}

const IconButtonText = styled.span`
  margin-left: auto;
  margin-right: auto;
  font-size: ${p => p.fontSize || 'inherit'};
`

const StyledIconButton = styled(Button).attrs(p => ({
  color: p.color || 'primary',
  thin: 'true',
}))`
  display: flex;
  align-items: center;
  padding: 0.125rem 0.5rem 0.125rem 0.25rem;
  margin: 0.25rem 0.5rem;
  width: ${p => p.width || 'auto'};
  :last-child {
    margin-right: 0;
  }
  font-size: 11pt;
`

const StyledIconButtonIcon = styled(FontAwesomeIcon)`
  margin-right: 0.25rem;
  width: 0.5rem;
`

export default IconButton
