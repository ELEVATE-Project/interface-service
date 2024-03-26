<div align="center">

# Interface Service

<a href="https://shikshalokam.org/elevate/">
<img
    src="https://shikshalokam.org/wp-content/uploads/2021/06/elevate-logo.png"
    height="140"
    width="300"
  />
</a>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/interface-service/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/interface-service/tree/master)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_interface-service&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_interface-service)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_interface-service&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_interface-service)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_interface-service&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_interface-service)[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Docs](https://img.shields.io/badge/Docs-success-informational)](https://elevate-docs.shikshalokam.org/mentorEd/intro)
[![Docs](https://img.shields.io/badge/API-docs-informational)](https://elevate-apis.shikshalokam.org/interface-service/api-doc)

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/interface-service?filename=src%2Fpackage.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<details><summary>CircleCI insights</summary>

[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/mentoring/master/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/mentoring/workflows/buil-and-test/overview?branch=integration-testing&reporting-window=last-30-days&insights-snapshot=true)

</details>

<!-- <details><summary>dev</summary>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/mentoring/tree/dev.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/mentoring/tree/dev)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/user/dev?filename=src%2Fpackage.json)
[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/mentoring/dev/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/mentoring/workflows/buil-and-test/overview?branch=integration-testing&reporting-window=last-30-days&insights-snapshot=true)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=duplicated_lines_density&branch=dev)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=coverage&branch=dev)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=vulnerabilities&branch=revert-77-integration-test)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring) -->

</details>

</br>
The Mentoring building block enables effective mentoring interactions between mentors and mentees. The capability aims to create a transparent eco-system to learn, connect, solve, and share within communities. MentorED is an open source mentoring application that facilitates peer learning and professional development by creating a community of mentors and mentees.

</div>
<br>

# System Requirements

-   **Operating System:** Ubuntu 22
-   **Node.js:** v20
-   **PostgreSQL:** 16
-   **Citus:** 12.1

# Setup Options

Elevate interface-service services can be setup in local using two methods:

<details><summary>Dockerized service with local dependencies(Intermediate)</summary>

## A. Dockerized Service With Local Dependencies

**Expectation**: Run single docker containerized service with existing local (in host) or remote dependencies.

Coming soon...

</details>

<details><summary>Local Service with local dependencies(Hardest)</summary>

## B. Local Service With Local Dependencies

**Expectation**: Run single service with existing local dependencies in host (**Non-Docker Implementation**).

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

</details>
<br>

# Run tests

## Integration tests

```
npm run test:integration
```

To know more about integration tests and their implementation refer to the project [Wiki](https://github.com/ELEVATE-Project/user/wiki/Integration-and-Unit-testing).

## Unit tests

```
npm test
```

# Used in

This project was built to be used with [Mentoring Service](https://github.com/ELEVATE-Project/mentoring.git) and [User Service](https://github.com/ELEVATE-Project/user.git).

The frontend/mobile application [repo](https://github.com/ELEVATE-Project/mentoring-mobile-app).

You can learn more about the full implementation of MentorEd [here](https://elevate-docs.shikshalokam.org/.mentorEd/intro) .

# Team

<a href="https://github.com/ELEVATE-Project/mentoring/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ELEVATE-Project/scheduler" />
</a>

<br>

# Open Source Dependencies

Several open source dependencies that have aided Mentoring's development:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
