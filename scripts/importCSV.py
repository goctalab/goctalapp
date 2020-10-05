#!/usr/bin/env python

import subprocess
import sys
import sqlite3
import argparse
from os import path, environ
import pdb #, pdb.set_trace()

parser = argparse.ArgumentParser(description='Import csv data into the db.')
parser.add_argument('csv_file', metavar='F', type=str,
                   help='a path to the csv to load')
parser.add_argument('--db', type=str,
                   help='location of the db file')

args = parser.parse_args()

DATA_TABLE = environ.get('SITES_TABLE', 'sites')
DB_NAME = environ.get('DB_NAME', 'gocta')
DB_PATH = '~/{}.db'.format(DB_NAME);

csv_path = args.csv_file;
DB = args.db if args.db else path.expanduser(DB_PATH);

if not path.exists(csv_path):
  print("csv file path doesn't exist");
  sys.exit

def fill_db():
  connection = sqlite3.connect(DB);

  connection.text_factory = str
  cursor = connection.cursor()

  stmt = "DROP TABLE IF EXISTS {}".format(DATA_TABLE)
  cursor.execute(stmt)

  import_stmt = ".import {} {}".format(args.csv_file, DATA_TABLE)
  # pdb.set_trace()
  print("Importing with command:")
  print(import_stmt)

  output = subprocess.check_output(["sqlite3", DB, 
    ".mode csv", 
    import_stmt
  ])

  print("Done.")

resp = input("Will DROP the data table and create new one from csv data. Proceed? Y/n : ") 

if resp != "Y":
  print("Will not proceed. Have a nice day :)");
  sys.exit()
else:
  fill_db()
