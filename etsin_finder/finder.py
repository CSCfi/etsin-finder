# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Main finder initialization file"""


from etsin_finder.app import create_app

app = create_app()

if __name__ == "__main__":
    if (os.path.isfile('./app_config')):
        app.run(host='0.0.0.0')
    else:
        app.run()
