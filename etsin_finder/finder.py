# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Main finder initialization file"""

import os.path
import logging
import logging.config
from etsin_finder.app import create_app

app = create_app()

app.logger.error('testing...')

# if __name__ == "__main__":
app.logger.error('does it work...')
if (os.path.isfile('./app_config')):
    app.logger.error('lets see')
    app.run(host='0.0.0.0')
else:
    app.logger.error('or... see')
    app.run()
