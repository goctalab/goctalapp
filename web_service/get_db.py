goctalab@goctalab:/var/www/html$ sudo vi /var/www/html/gocta_api/get_db.py 

def application(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    try:
        db = '/home/goctalab/Documentos/db/gocta.db'
        filelike = file(db, 'rb')
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return

    start_response(status, response_headers)
    # block_size = 4096

    if 'wsgi.file_wrapper' in environ:
            return environ['wsgi.file_wrapper'](filelike, block_size)
    else:
        return iter(lambda: filelike.read(block_size), '')
