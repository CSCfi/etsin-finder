# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Direct authentication related functionalities"""

from urllib.parse import urlparse
from flask import session
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from etsin_finder.app import app
from etsin_finder.log import log
from etsin_finder.utils import executing_travis
from etsin_finder.constants import SAML_ATTRIBUTES
from etsin_finder.app_config import get_app_config

def get_saml_auth(flask_request, service):
    """Get saml auth

    Args:
        flask_request (object): flask.Request

    Returns:
        object: SP SAML instance.

    """
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request, service), custom_base_path=app.config.get(('SAML_PATH' + service), None))

def init_saml_auth(saml_prepared_flask_request, service):
    """Init saml auth

    Args:
        saml_prepared_flask_request (object): Prepared flask request.

    Returns:
        object: Initializes the SP SAML instance.

    """
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config.get(('SAML_PATH' + service), None))

def is_authenticated_through_direct_proxy():
    """Is user authenticated through the old proxy solution

    Returns:
        bool: Is auth.

    """
    if ('samlUserdata' in session and len(session.get('samlUserdata', None)) > 0):
        return True
    return False

def prepare_flask_request_for_saml(request, service):
    """Prepare Flask request for saml

    Args:
        request (object): flask.Request

    Returns:
        dict: Request data.

    """
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    url_data = urlparse(request.url)

    # If in local development environment this will redirect the legacy SAML login right.
    if request.host == 'localhost':
        http_host = '30.30.30.30'
    # Non-local login through Etsin SSO
    elif service == 'ETSIN':
        http_host = get_app_config(app.testing).get('SERVER_ETSIN_DOMAIN_NAME')
    # Non-local login through Qvain SSO
    elif service == 'QVAIN':
        http_host = get_app_config(app.testing).get('SERVER_QVAIN_DOMAIN_NAME')

    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': http_host,
        'server_port': url_data.port,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
    }

def reset_flask_session_on_login():
    """Reset Flask session on login"""
    session.clear()
    session.permanent = True


def reset_flask_session_on_logout():
    """Reset Flask session on logout"""
    session.clear()