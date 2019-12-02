# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RPC API endpoints, meant to be used by Qvain Light form"""

from functools import wraps
import inspect
from flask import request, session
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder import authentication
from etsin_finder.qvain_light_service import change_cumulative_state
from etsin_finder.finder import app
from etsin_finder.qvain_light_utils import get_dataset_creator

log = app.logger

def log_request(f):
    """
    Log request when used as decorator.

    :param f:
    :return:
    """
    @wraps(f)
    def func(*args, **kwargs):
        """
        Log requests.

        :param args:
        :param kwargs:
        :return:
        """
        csc_name = authentication.get_user_csc_name() if not app.testing else ''
        log.info('[{0}.{1}] {2} {3} {4} USER AGENT: {5}'.format(
            args[0].__class__.__name__,
            f.__name__,
            csc_name if csc_name else 'UNAUTHENTICATED',
            request.environ['REQUEST_METHOD'],
            request.path,
            request.user_agent))
        return f(*args, **kwargs)
    return func

class QvainDatasetChangeCumulativeState(Resource):
    """Metax RPC for changing cumulative_state of a dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)
        self.parser.add_argument('cumulative_state', type=int, required=True)

    @log_request
    def post(self):
        """
        Change cumulative_state of a dataset in Metax.

        Arguments:
            identifier {string} -- The identifier of the dataset.
            cumulative_state {integer} -- The new cumulative state.

        Returns:
            [type] -- Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        cumulative_state = args['cumulative_state']
        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401

        # only creator of the dataset is allowed to modify it
        user = session["samlUserdata"]["urn:oid:1.3.6.1.4.1.16161.4.0.53"][0]
        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Changing cumulative state not allowed. Creator: \"{1}\"'.format(user, creator))
            return {"PermissionError": "User not authorized to to change cumulative state of dataset."}, 403
        metax_response = change_cumulative_state(cr_id, cumulative_state)
        return metax_response