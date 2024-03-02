import random
import sqlite3
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Get the database file path from command line arguments
path = Path(sys.argv[1])

# Connect to the database
conn = sqlite3.connect(path)

# Create a cursor object
cursor = conn.cursor()

# Create the table if it does not exist
cursor.execute('''CREATE TABLE IF NOT EXISTS speedtest (
                    speed REAL,
                    date TEXT
                )''')


def insert_data(speed, date):
    # Convert date to UTC string with "Z" suffix
    utc_date_str = date.isoformat() + "z"
    cursor.execute("INSERT INTO speedtest (speed, date) VALUES (?, ?)", (speed, utc_date_str))

insert_data(0, datetime.utcnow())

# # Generate and insert 1000 rows of data with random speed and date
# for i in range(1000):
#     # Generate random speed in the range [1, 100]
#     speed = random.uniform(1, 100)
    
#     # Generate date and time going back in time by one hour each time
#     date = (datetime.utcnow() - timedelta(hours=i)).strftime('%Y-%m-%d %H:%M:%S')
    
#     # Insert the data into the table
#     insert_data(speed, date)

# # Generate and insert data for today
# today = datetime.utcnow().strftime('%Y-%m-%d')
# for i in range(100):
#     speed = random.uniform(1, 100)
#     time = (datetime.strptime(today, '%Y-%m-%d') - timedelta(minutes=i)).strftime('%Y-%m-%d %H:%M:%S')
#     insert_data(speed, time)

# # Generate and insert data for last week
# last_week = (datetime.utcnow() - timedelta(days=7)).strftime('%Y-%m-%d')
# for i in range(100):
#     speed = random.uniform(1, 100)
#     time = (datetime.strptime(last_week, '%Y-%m-%d') - timedelta(minutes=i)).strftime('%Y-%m-%d %H:%M:%S')
#     insert_data(speed, time)

# # Generate and insert data for last year
# last_year = (datetime.utcnow() - timedelta(days=365)).strftime('%Y-%m-%d')
# for i in range(100):
#     speed = random.uniform(1, 100)
#     time = (datetime.strptime(last_year, '%Y-%m-%d') - timedelta(days=i)).strftime('%Y-%m-%d %H:%M:%S')
#     insert_data(speed, time)

# # Commit the changes to the database
conn.commit()

# # Close the connection
conn.close()

print("Database created successfully!")
