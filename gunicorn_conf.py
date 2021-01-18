"""
gunicorn WSGI server configuration.

"""
import gevent.monkey
gevent.monkey.patch_all()
from multiprocessing import cpu_count
from os import environ

def max_workers():
    return cpu_count() * 2 + 1

max_requests = 1000
worker_class = 'gevent'
workers = max_workers()
preload_app = False

secure_scheme_headers = {
    'X-FORWARDED-PROTOCOL': 'ssl',
    'X-FORWARDED-PROTO': 'https',
    'X-FORWARDED-SSL': 'on'
}
