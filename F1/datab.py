import datetime
import time
import flask
from flask import jsonify
from flask import request, make_response
import mysql.connector
from mysql.connector import Error
import random
# setting up an application name
app = flask.Flask(__name__)
app.config["DEBUG"] = True

# creates the connection with the AWS database by taking the user database name, username, password, and the host name
def create_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

# Takes in the users query provided by the user and executes it by first connecting to the database and then executing the given query
def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"The error '{e}' occurred")

# First taking the the query that instructs the database to return data to display then it returns the given data
def execute_read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"The error '{e}' occurred")




friend = []

def databasedata():
    connection = create_connection("cis3368.cba7r5iszeox.us-east-2.rds.amazonaws.com", "admin", "PogPogAnthony124", "CIS3368db")
    query = "SELECT * FROM friend"
    dbdata = execute_read_query(connection, query)
    for row in dbdata:
        results = {"id":row[0], "fname":row[1], "lname":row[2]}
        friend.append(results)
    return friend

friends = databasedata()




# default url without any routing as GET request / returns the html code to the default url
@app.route("/", methods=["GET"])
def home(): 
    return "<h1> WELCOME TO MY RANDOM MOVIE SELECTOR API! </h1>"

#endpoint to get all the cars
@app.route('/api/friends/all', methods=["GET"]) 
def api_all():
    connection = create_connection("cis3368.cba7r5iszeox.us-east-2.rds.amazonaws.com", "admin", "PogPogAnthony124", "CIS3368db")
    cursor = connection.cursor(dictionary=True)
    sql = "SELECT * FROM driversdata"
    cursor.execute(sql)
    rows = cursor.fetchall()
    results = []
    for user in rows:
        results.append(user)

    return jsonify(results) # returns friends in json format
# -------- Delete user -------------
# Delete a user from the databas named friend
@app.route('/api/deleteuser',methods=['DELETE'])
def deleteuser_db():
    # takes the data from the user and takes in the "id" field
    request_data = request.get_json()
    delid = request_data["id"]

    # Create a connection with the database by providing the address,name, and password
    # Also write the SQL code in order to give instructions to the database
    connection = create_connection("cis3368.cba7r5iszeox.us-east-2.rds.amazonaws.com", "admin", "PogPogAnthony124", "CIS3368db")
    query = "DELETE FROM friend WHERE id = %s" % (delid) # deletes from the friend table given where the id matches
    execute_query(connection,query) 
    return 'DELETE USER REQUEST WORKED' # returns string to make sure it worked

# -------- Updates Info ------------
# Update a user from the database named friend
@app.route('/api/updateuser',methods=['PUT'])
def updateuser_db():
    y = "both"
    # Request data from the user in POSTMAN in order to update the information
    request_data = request.get_json()

    # requires the id, fname, and lname in order to update the information
    upid = request_data["id"]
    if 'fname' in request_data:
        upfname = request_data['fname']
    else:
        y = "last"
    if 'lname' in request_data:
        uplname = request_data['lname']
    else:
        y = "first"

    # creates the connection between my AWS db
    connection = create_connection("cis3368.cba7r5iszeox.us-east-2.rds.amazonaws.com", "admin", "PogPogAnthony124", "CIS3368db")
    if y == "both":
        query = "UPDATE friend SET firstname = '"+upfname+"', lastname = '"+uplname+"' WHERE id = %s" % (upid) # will update the friend list values firstname,lastname, where the id matches the one chosen
    elif y == "first":
        query = "UPDATE friend SET firstname = '"+upfname+"' WHERE id = %s" % (upid)
    elif y == "last":
        query = "UPDATE friend SET lastname = '"+uplname+"' WHERE id = %s" % (upid)
    
    execute_query(connection,query) # executes query
    return 'UPDATE USER REQUEST WORKED' # returns string to make sure it works



@app.route('/api/movies/insert', methods=['POST'])
def norm_str():
    ids = [] # list for the ids provided

    # request data needed for the query
    request_data = request.get_json()
    num_users = request_data['num'] # number of user that are going to be used
    """
    if "user1" in request_data:
        User1 = request_data['user1']
    if "user2" in request_data:
        User2 = request_data['user2']
    if "user3" in request_data:
        User3 = request_data['user3']
    """

    # while loop that uses the number given (which is the amount of user that are going to be used)
    # then it will run that loop for that many users
    # the loop will append the user id that is going to be provided by the person that inserts the data
    # so for example if i want to only use to users i would {"num": 2, "user1": 1, "user2": 4} <-- the number that corresponds to the user(X) is going to be 
    # the id that is given to the user in the first table 

    x = 1
    while x <= num_users:
        y = "user%s" % (x)
        if y in request_data:
            ids.append(request_data[y])
        x = x + 1

    norm_str = ""  # this string is going to turn eventually to the ids of the user --> id = [1,2,4]
    
    # converts the numbers from the list into string and creates a tuple in order to insert it into the query
    # this allows the us to insert the stirng of users into the database
    # the table that we will be using will be a single row/column that only contains the string of users
    # this data will be used in the next endpoint
    x = 1
    while x <= num_users:
        if (num_users - x != 0):
            num = "%s," % (str(ids[x - 1]))
            norm_str += num
        else: 
            norm_str += str(ids[x-1])
        x = x + 1
    
    # creates the connection with the AWS database
    connection = create_connection("cis3368.cba7r5iszeox.us-east-2.rds.amazonaws.com", "admin", "PogPogAnthony124", "CIS3368db")
    query = "UPDATE selected SET list = '%s' WHERE id = 1" % (norm_str)  # this query will update the 1 row/column to the string of users that was selected by the users for the movies
    execute_query(connection,query) 

    return 'INSERT USERS INTO DATABASE WORKED' # makes sure the users were inserted to the db

app.run()