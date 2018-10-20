## Create an ECMAScript (JavasScript) web server based on Node.js, express and docker

### How to run/test this package, standalone on your local system

1. latest version of docker, node and npm installed and running

2. change to your development folder, where you may have other projects and clone this repository into it (which will create the project-dir)

		git clone git@github.com:pubcore/node-server-docker.git 		

4. find/create ssl key- and certificate-files (ssl-files) for your local domain
... you need it for next step

5. switch docker to swarm mode

		docker swarm init

6. register secrets  
Create dhparam.pem file used below with (replace  &lt;pathToFile&gt; with directory where the ssl-files stored in:

		openssl dhparam -out <pathToFile>dh-strong.pem 2048
Register keys and certificates created for your domain you are running your (local) development system

		docker secret create ssl-key <absolute path to ssl key file>
		docker secret create ssl-cert <absolute path to ssl crt (certificate) file>
		docker secret create ssl-csr <absolute path to ssl csr file>
		docker secret create ssl-dhparam <absolute path to dh-strong.pem file>

7. change into project-dir

8. register configs

		docker config create verdaccio ./verdaccio-config.yml

9. install application packages

		npm install

10. start server

		npm run start

11. test it: you should see "Hello world!"

		https://<your-local-domain>:8443/
