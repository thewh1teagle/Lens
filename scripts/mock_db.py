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

# Generate and insert 1000 rows of data with random speed and date
for i in range(1000):
    # Generate random speed in the range [1, 100]
    speed = random.uniform(1, 100)
    
    # Generate date and time going back in time by one hour each time
    date = (datetime.now() - timedelta(hours=i)).strftime('%Y-%m-%d %H:%M:%S')
    
    # Insert the data into the table
    cursor.execute("INSERT INTO speedtest (speed, date) VALUES (?, ?)", (speed, date))

# Commit the changes to the database
conn.commit()

# Close the connection
conn.close()

print("Database created successfully!")
