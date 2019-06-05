import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router'
import Translate from 'react-translate-component'
import Card from './general/card'
import LoginButton from '../general/navigation/loginButton'

class QvainLogin extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    Stores: PropTypes.object.isRequired,
    redirectPath: PropTypes.string
  }

  static defaultProps = {
    loading: false,
    redirectPath: '/'
  }

  render() {
    const { loading, redirectPath } = this.props
    const { cscUserLogged } = this.props.Stores.Auth
    return (
      <Card className="container">
        {(loading && !cscUserLogged) && <p>Loading...</p>}
        {(!loading && !cscUserLogged) && (
          <Fragment>
            <Translate component="p" content="qvain.notLoggedIn" />
            <LoginButton isLoggedInKey="cscUserLogged" />
          </Fragment>
        )}
        {(cscUserLogged) && <Redirect to={redirectPath} />}
      </Card>
    );
  }
}

export default inject('Stores')(observer(QvainLogin));
