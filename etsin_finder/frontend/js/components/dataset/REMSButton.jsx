import React from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Button from '../general/button'
import etsinTheme from '../../styles/theme'
import Loader from '../general/loader'

const REMSButton = props => {
  let button
  switch (props.applicationState) {
    case 'Error':
      button = (
        <div aria-hidden="true" title={translate('dataset.access_unavailable')}>
          <Button disabled noMargin>
            {props.loading ? (
              <>
                <Translate content="dataset.access_permission" />
                <Loader color="white" active size="1.2em" />
              </>
            ) : (
              <Translate content="dataset.access_permission" />
            )}
          </Button>
        </div>
      )
      break
    case 'apply':
      button = (
        <Button onClick={props.onClick} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_permission" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_permission" />
          )}
        </Button>
      )
      break
    case 'draft':
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.yellow} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_draft" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_draft" />
          )}
        </Button>
      )
      break
    case 'submitted':
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.yellow} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_request_sent" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_request_sent" />
          )}
        </Button>
      )
      break
    case 'approved':
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.primary} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_granted" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_granted" />
          )}
        </Button>
      )
      break
    case 'rejected':
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.error} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_denied" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_denied" />
          )}
        </Button>
      )
      break
    default:
      button = (
        <Button onClick={props.onClick} color={etsinTheme.color.primary} noMargin>
          {props.loading ? (
            <>
              <Translate content="dataset.access_permission" />
              <Loader color="white" active size="1.2em" />
            </>
          ) : (
            <Translate content="dataset.access_permission" />
          )}
        </Button>
      )
      break
  }
  return button
}

export default REMSButton
