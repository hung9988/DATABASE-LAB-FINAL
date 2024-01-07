# HUST STUDENT MANAGER

This is a simple web application aimed to simulate a simple course registration system based on HUST education system.

## Features

* A student can sign up for an account to register for classes when they are opened.
* Teacher will already have the account when they enter the school and can login to create or delete their own classes.


## Database Requirements
* There must be a login role with name users and password users beforehand:
  ```bash
  CREATE ROLE users LOGIN PASSWORD 'users';
* If the superuser is not postgres:0000, you should change the DB_URL_ADMIN string in the .env file in Admin_application accordingly to your superuser account.
* Restore the demo database with this command:
  ```bash
  psql -U postgres -f HUST-STUDENT-MANAGER.sql
## Application Requirements

* Node.js - v14.0.0 or above
* npm - v6.0.0 or above
* A modern web browser

## Installation

Follow these steps to install the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/hung9988/HUST-STUDENT-MANAGER
3. Navigate into the project directory:
   ```bash
   cd HUST-STUDENT-MANAGER
4. Navigate into each application ( User and Admin ):
   ```bash
   cd Admin_application
   cd User_application
6. Install the dependencies for each folders:
   ```bash
   npm install


## Usage

To run the application:
1. Navigate to Admin/User application:
   ```bash
   cd Admin_application
   cd User_application
2. Start the development server:
   ```bash
   npm run dev
   
