pipeline {
	agent any
	
	environment {
		BACKEND_IMAGE = "sfb-backend"
		BACKEND_CONTAINER = "sFb-backend"
		FRONTEND_IMAGE = "sfb-frontend"
		FRONTEND_CONTAINER = "sFb-frontend"
		NETWORK_NAME = "sfb-network"
		ENV_FILE = ".env"
	}

	stages {
		stage('Prepare Env') {
			 steps {
				withCredentials([file(credentialsId: '811b5c6c-064b-4a7e-896a-f6a5701ee92b', variable: 'ENV_FILE')]) {
					sh 'cp $ENV_FILE backend/.env'
					}
			}
		}

		stage('Setup') {
         		steps {
                		sh "git config --global --add safe.directory \$PWD"
            		}
        	}

		stage('Clone Repository') {
			steps {
				checkout scm
			}
		}

		stage('Build Backend Docker Image') {
			steps {
				dir('backend') {
					sh "docker build -t ${BACKEND_IMAGE} ."
				}
			}
		}

		stage('Build Frontend Docker Image') {
			steps {
				dir('frontend') {
					sh "docker build -t ${FRONTEND_IMAGE} ."
				}
			}
		}

		stage('Stop and Remove Old Containers') {
			steps {
				sh """
				docker stop ${BACKEND_CONTAINER} || true
				docker rm ${BACKEND_CONTAINER} || true
				docker stop ${FRONTEND_CONTAINER} || true
				docker rm ${FRONTEND_CONTAINER} || true
                		"""
			}
		}
		
		stage('Run Backend Container') {
			steps {
				sh """
				docker run -d --name ${BACKEND_CONTAINER} \
				--network ${NETWORK_NAME} \
				--env-file backend/${ENV_FILE} \
				-p 8080:8080 \
				${BACKEND_IMAGE}
				"""
			}
		}

		stage('Run Frontend Container') {
			steps {
				sh """
				docker run -d --name ${FRONTEND_CONTAINER} \
				--network ${NETWORK_NAME} \
				-p 3000:3000 \
				${FRONTEND_IMAGE}
				"""
			}
		}

		stage('Run Backend Tests') {
			steps {
				sh "docker exec ${BACKEND_CONTAINER} ./run-test.sh"
			}
		}
	}
}
