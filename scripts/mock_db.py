import random
import sqlite3
import sys
from datetime import datetime, timedelta
from pathlib import Path
import time

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

def random_speed():
    chance = random.randint(1, 100)
    # 95% range(60,70)
    if chance <= 95:
        return random.randint(60, 70)
    
    # 2% range(30,59)
    elif chance <= 98:
        return random.randint(30, 59)
    # 1% 0
    else:
        return 0


virtual_date = datetime.utcnow() - timedelta(days=30)
while virtual_date < datetime.utcnow():
    speed = random_speed()
    print(f'Inserting date {virtual_date} with speed {speed}')
    insert_data(speed, virtual_date)
    virtual_date += timedelta(minutes=30)
    # time.sleep(1)

conn.commit()
conn.close()

print("Database created successfully!")
