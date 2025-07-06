pipeline {
	agent any
	
	environment {
		DOCKER_REPO = "summeree22"
		BACKEND_IMAGE = "${DOCKER_REPO}/sfb-backend"
		BACKEND_CONTAINER = "sFb-backend"
		FRONTEND_IMAGE = "${DOCKER_REPO}/sfb-frontend"
		FRONTEND_CONTAINER = "sFb-frontend"
		NETWORK_NAME = "startedfrombottom_sFb-network"
		ENV_FILE = ".env"		
	}

	stages {
		stage('Prepare Env') {
			 steps {
				withCredentials([file(credentialsId: 'c859bfe1-8e5c-4fba-bebe-2975da846d28', variable: 'ENV_FILE')]) {
					sh 'cp $ENV_FILE backend/.env'
					}
			}
		}

		stage('Setup') {
         		steps {
				script {
					def workspaceDir = pwd()
                			sh "git config --global --add safe.directory ${workspaceDir}"
	            		}
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
					sh "docker build -t ${BACKEND_IMAGE}:latest ."
				}
			}
		}

		stage('Build Frontend Docker Image') {
			steps {
				dir('frontend') {
					withCredentials([string(credentialsId: 'react-backend-url', variable: 'REACT_APP_API_BASE_URL')]) {
                                                sh """
                                                docker build \
                                                --build-arg REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} \
                                                -t ${FRONTEND_IMAGE}:latest .
                                                """
                                        }
				}
			}
		}

		stage('Docker Hub Login') {
			steps {
				 withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
					sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
				}
			}
		}

		stage('Push Backend Image to Docker Hub') {
			steps {
				sh "docker push ${BACKEND_IMAGE}:latest"
			}
		}

		stage('Push Frontend Image to Docker Hub') {
			steps {
				sh "docker push ${FRONTEND_IMAGE}:latest"
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
				${BACKEND_IMAGE}:latest
				"""
			}
		}

		stage('Run Frontend Container') {
			steps {
				sh """
				docker run -d --name ${FRONTEND_CONTAINER} \
				--network ${NETWORK_NAME} \
				-p 3000:80 \
				${FRONTEND_IMAGE}:latest
				"""
			}
		}

		stage('Run Backend Tests') {
			steps {
				sh "docker exec ${BACKEND_CONTAINER} chmod +x ./run-test.sh"
				sh "docker exec ${BACKEND_CONTAINER} ./run-test.sh"
            		}
        	}
	}
}
