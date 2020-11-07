# this code lives installed in
# /var/www/html/gocta_api/get_db_version.py 
# responsible for the endpoint 192.168.0.105/get_db_version
# returns version number to compare with version in app

import sqlite3
import subprocess

db_path = '/home/goctalab/Documentos/db/gocta.db'

def connect_db():
    connection = sqlite3.connect(db_path);
    print("connecting to db")
    cursor = connection.cursor()
    return cursor

def get_db_user_version():
    cursor = connect_db()
    version_stmt = "PRAGMA user_version"
    version = subprocess.check_output(["sqlite3", db_path,
        version_stmt
    ])
    print("getting version db version = {}".format(version))
    return version

def application(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    
    start_response(status, response_headers)
    
    v = get_db_user_version()
    return [v]
