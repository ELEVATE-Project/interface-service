# ShikshaLokam Interface Setup Documentation

## System Requirements

-   **Operating System:** Ubuntu 22
-   **Node.js:** v20
-   **PostgreSQL:** 16
-   **Citus:** 12.1

## Installations

### Install Node.js LTS

Refer to the [NodeSource distributions installation scripts](https://github.com/nodesource/distributions#installation-scripts) for Node.js installation.

```bash
$ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

### Install Build Essential

```bash
$ sudo apt-get install build-essential
```

### Install PM2

Refer to [How To Set Up a Node.js Application for Production on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04).

**Run the following command**

```bash
$ sudo npm install pm2@latest -g
```

## Setting up Repository

### Clone the mentoring repository to /opt/backend directory

```bash
opt/backend$ git clone -b develop-2.5 --single-branch "https://github.com/ELEVATE-Project/interface-service.git"
```

### Install Npm packages from src directory

```bash
backend/interface-service/src$ sudo npm i
```

### Create .env file in src directory

```bash
interface-service/src$ sudo nano .env
```

### Copy-paste the following env variables to the `.env` file:

```env
APPLICATION_PORT=3569
API_DOC_URL= /interface/api-doc
APPLICATION_ENV= development
INSTALLED_PACKAGES= "elevate-user elevate-mentoring elevate-scheduler"
MENTORING_SERVICE_BASE_URL= http://localhost:3000
NOTIFICATION_SERVICE_BASE_URL= http://localhost:7201
REQUIRED_PACKAGES= "elevate-user@1.1.38 elevate-mentoring@1.1.47 elevate-scheduler@1.0.4"
SCHEDULER_SERVICE_BASE_URL= http://localhost:7401
SUPPORTED_HTTP_TYPES= "GET POST PUT PATCH DELETE"
USER_SERVICE_BASE_URL= http://localhost:3001
created_time= "2024-02-07T04:51:22.789813746Z"
custom_metadata= null
destroyed= false
version= 21

```

## Start the Service

Navigate to the src folder of interface service and run pm2 start command:

```bash
interface-service/src$ pm2 start app.js -i 2 --name elevate-interface
```

#### Run pm2 ls command

```bash
$ pm2 ls
```

Output should look like this (Sample output, might slightly differ in your installation):

```bash
┌────┬─────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                    │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 1  │ elevate-interface       │ default     │ 1.0.0   │ cluster │ 79252    │ 2D     │ 0    │ online    │ 0%       │ 79.2mb   │ jenkins  │ disabled │
│ 2  │ elevate-interface       │ default     │ 1.0.0   │ cluster │ 79262    │ 2D     │ 0    │ online    │ 0%       │ 78.7mb   │ jenkins  │ disabled │
└────┴─────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

This concludes the interface service and dependency setup.

Save and exit.
