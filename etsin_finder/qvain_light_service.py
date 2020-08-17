# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain Light"""

import requests

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_empty, FlaskService
from etsin_finder.request_utils import make_request

log = app.logger

class MetaxQvainLightAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_qvain_api_config = get_metax_qvain_api_config(app.testing)

        if metax_qvain_api_config:

            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = 'https://{0}/rest/directories'.format(metax_qvain_api_config.get('HOST')) + \
                                                       '/files?project={0}&path=%2F'
            self.METAX_GET_DIRECTORY = 'https://{0}/rest/directories'.format(metax_qvain_api_config.get('HOST')) + \
                                       '/{0}/files'
            self.METAX_GET_FILE = 'https://{0}/rest/files'.format(metax_qvain_api_config.get('HOST')) + \
                                  '/{0}'
            self.METAX_GET_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                     '/{0}?file_details'
            self.METAX_GET_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                                               '?metadata_provider_user={0}&file_details&ordering=-date_created'
            self.METAX_GET_ALL_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                '?metadata_provider_user={0}&file_details&ordering=-date_created&no_pagination=true'
            self.METAX_CREATE_DATASET = 'https://{0}/rest/datasets?file_details'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_PATCH_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                       '/{0}?file_details'
            self.METAX_DELETE_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                        '/{0}'
            self.METAX_CHANGE_CUMULATIVE_STATE = 'https://{0}/rpc/datasets/change_cumulative_state'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_REFRESH_DIRECTORY_CONTENT = 'https://{0}/rpc/datasets/refresh_directory_content'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_FIX_DEPRECATED = 'https://{0}/rpc/datasets/fix_deprecated'.format(metax_qvain_api_config.get('HOST'))
            self.user = metax_qvain_api_config.get('USER')
            self.pw = metax_qvain_api_config.get('PASSWORD')
            self.verify_ssl = metax_qvain_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(headers={'Accept': 'application/json', 'Content-Type': 'application/json'},
                    auth=(self.user, self.pw),
                    verify=self.verify_ssl,
                    timeout=10)
        args.update(kwargs)
        return args

    def get_directory_for_project(self, project_identifier, params=None):
        """Get directory contents for a specific project

        Args:
            project_identifier (str): Project identifier.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_DIRECTORY_FOR_PROJECT_URL.format(project_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        params=params,
                                        **self._get_args()
                                        )
        if not success:
            log.warning("Failed to get directory contents for project {}".format(project_identifier))
            return None
        return resp

    def get_directory(self, dir_identifier, params=None):
        """Get a specific directory with directory's id

        Args:
            dir_identifier (str): Directory identifier.
            params (dict, optional): Query parameters. Defaults to None.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_DIRECTORY.format(dir_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        params=params,
                                        **self._get_args())
        if not success:
            log.warning("Failed to get directory {}".format(dir_identifier))
            return None
        return resp

    def get_file(self, file_identifier):
        """Get a specific file with file's id

        Args:
            file_identifier (str): File identifier.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_FILE.format(file_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        **self._get_args()
                                        )
        if not success:
            log.warning("Failed to get file {}".format(file_identifier))
            return None
        return resp

    def patch_file(self, file_identifier, data):
        """Patch metadata for a file with given data.

        Useful for updating file_characteristics. Can be also used to change other fields
        such as identifier, so be careful when passing user input to avoid data corruption.

        Arguments:
            file_identifier (str): The identifier of the file.
            data (dict): Dictionary of fields that will be replaced in file metadata, other fields directly under the file will be
                preserved. For example, data = { 'file_characteristics': { 'csv_has_header': True } } would enable
                file_characteristics.csv_has_header and remove any other fields nested under file_characteristics.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_GET_FILE.format(file_identifier)

        resp, code, success = make_request(requests.patch,
                                           req_url,
                                           json=data,
                                           **self._get_args()
                                           )
        if not success:
            log.warning("Failed to patch file {}".format(file_identifier))
        return resp, code

    def get_datasets_for_user(self, user_id, limit, offset, no_pagination):
        """Get datasets created by the specified user.

        Uses pagination, so offset and limit are used as well.

        Args:
            user_id (str): User identifier.
            limit (list): The limit of returned datasets.
            offset (list): The offset for pagination.
            no_pagination (bool): To use pagination or not.

        Returns:
            Metax response.

        """
        req_url = self.METAX_GET_DATASETS_FOR_USER.format(user_id)
        if (no_pagination):
            req_url = self.METAX_GET_ALL_DATASETS_FOR_USER.format(user_id)

        if (limit):
            req_url = req_url + "&limit={0}".format(limit[0])
        if (offset):
            req_url = req_url + "&offset={}".format(offset[0])

        resp, _, success = make_request(requests.get,
                                        req_url,
                                        **self._get_args()
                                        )
        if not success or len(resp) == 0:
            log.info('No datasets found.')
            return 'no datasets'
        return resp

    def create_dataset(self, data, params=None, use_doi=False):
        """Send the data from the frontend to Metax.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_CREATE_DATASET
        if use_doi is True:
            req_url += '&pid_type=doi'
        args = self._get_args(timeout=30)
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )
        if success:
            log.info('Created dataset with identifier: {}'.format(resp.get('identifier', 'COULD-NOT-GET-IDENTIFIER')))
        else:
            log.error('Failed to create dataset')
        return resp, status

    def update_dataset(self, data, cr_id, last_modified, params):
        """Update a dataset with the data that the user has entered in Qvain-light.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            cr_id (str): The identifier of the dataset.
            last_modified (str): HTTP datetime string (RFC2616)
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_PATCH_DATASET.format(cr_id)
        headers = {'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        log.debug('Request URL: {0}\nHeaders: {1}\nData: {2}'.format(req_url, headers, data))

        args = self._get_args(
            timeout=30,
            headers={'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        )
        resp, status, success = make_request(requests.patch,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )
        if status == 412:
            return 'Resource has been modified since last publish', status

        if success:
            log.info('Updated dataset with identifier: {}'.format(cr_id))
        else:
            log.error('Failed to update dataset {}'.format(cr_id))

        return resp, status

    def get_dataset(self, cr_id):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_GET_DATASET.format(cr_id)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             **self._get_args())
        if not success:
            log.warning('Failed to get dataset {}'.format(cr_id))
        return resp, status

    def delete_dataset(self, cr_id):
        """Delete dataset from Metax.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_DELETE_DATASET.format(cr_id)
        resp, status, success = make_request(requests.delete,
                                             req_url,
                                             **self._get_args())
        if success:
            log.info('Deleted dataset with identifier: {}'.format(cr_id))
        else:
            log.warning('Failed to delete dataset {}'.format(cr_id))
        return resp, status

    def change_cumulative_state(self, cr_id, cumulative_state):
        """Call Metax change_cumulative_state RPC.

        Arguments:
            cr_id (str): The identifier of the dataset.
            cumulative_state (int): New cumulative state.

        Returns:
            Metax response.

        """
        req_url = self.METAX_CHANGE_CUMULATIVE_STATE
        params = {
            "identifier": cr_id,
            "cumulative_state": cumulative_state
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Changed cumulative state of dataset {} to {}'.format(cr_id, cumulative_state))
        else:
            log.warning('Failed to change cumulative_state of dataset {} to {}'.format(cr_id, cumulative_state))
        return resp, status

    def refresh_directory_content(self, cr_identifier, dir_identifier):
        """Call Metax refresh_directory_content RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.
            dir_identifier (int): The identifier of the directory.

        Returns:
            Metax response.

        """
        req_url = self.METAX_REFRESH_DIRECTORY_CONTENT
        params = {
            "cr_identifier": cr_identifier,
            "dir_identifier": dir_identifier
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Refreshed content of directory {} in dataset {}'.format(dir_identifier, cr_identifier))
        else:
            log.warning('Failed to refresh content directory {} in dataset {}'.format(dir_identifier, cr_identifier))
        return resp, status

    def fix_deprecated_dataset(self, cr_identifier):
        """Call Metax fix_deprecated RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_FIX_DEPRECATED
        params = {
            "identifier": cr_identifier,
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Fixed deprecated dataset {}'.format(cr_identifier))
        else:
            log.warning('Failed to fix deprecated dataset {}'.format(cr_identifier))
        return resp, status

_metax_api = MetaxQvainLightAPIService(app)

def get_directory(dir_id, params=None):
    """Public function to get a specific directory with directory's id"""
    return _metax_api.get_directory(dir_id, params)

def get_directory_for_project(project_id, params=None):
    """Public function to get directory contents for a specific project"""
    return _metax_api.get_directory_for_project(project_id, params)

def get_file(file_identifier):
    """Public function to get a specific file with file's id"""
    return _metax_api.get_file(file_identifier)

def patch_file(file_identifier, data):
    """Public function to patch metadata for a file with given data."""
    return _metax_api.patch_file(file_identifier, data)

def get_datasets_for_user(user_id, limit, offset, no_pagination):
    """Public function to get datasets created by the specified user."""
    return _metax_api.get_datasets_for_user(user_id, limit, offset, no_pagination)

def create_dataset(form_data, params=None, use_doi=False):
    """Public function to Send the data from the frontend to Metax."""
    return _metax_api.create_dataset(form_data, params, use_doi)

def update_dataset(form_data, cr_id, last_modified, params=None):
    """Public function to Update a dataset with the data that the user has entered in Qvain-light."""
    return _metax_api.update_dataset(form_data, cr_id, last_modified, params)

def get_dataset(cr_id):
    """Public function to get dataset"""
    return _metax_api.get_dataset(cr_id)


def delete_dataset(cr_id):
    """Public function to delete dataset from Metax."""
    return _metax_api.delete_dataset(cr_id)

def change_cumulative_state(cr_id, cumulative_state):
    """Public function to change cumulative_state of a dataset in Metax."""
    return _metax_api.change_cumulative_state(cr_id, cumulative_state)

def refresh_directory_content(cr_identifier, dir_identifier):
    """Public function to call Metax refresh_directory_content RPC."""
    return _metax_api.refresh_directory_content(cr_identifier, dir_identifier)

def fix_deprecated_dataset(cr_id):
    """Public function to call Metax fix_deprecated RPC."""
    return _metax_api.fix_deprecated_dataset(cr_id)
