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
                   help='path location of the db file')

args = parser.parse_args()

# get table and db names, checking for env vars first
DATA_TABLE = environ.get('SITES_TABLE', 'sites')

DB_NAME = environ.get('DB_NAME', 'gocta')
DB_PATH = '~/{}.db'.format(DB_NAME);
DB = args.db if args.db else path.expanduser(DB_PATH)

csv_path = args.csv_file;

if not path.exists(csv_path):
  print("csv file path doesn't exist");
  sys.exit

def fill_db():
  connection = sqlite3.connect(DB);

  connection.text_factory = str
  cursor = connection.cursor()

  # TODO not dropping table
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

resp = input("Will delete the old data and create new data from csv. Proceed? Y/n : ") 

if resp != "Y":
  print("Will not proceed will the script. Have a nice day igual :)");
  sys.exit()
else:
  fill_db()
