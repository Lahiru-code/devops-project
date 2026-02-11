/*pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "lahiru2002/frontend-app"
        BACKEND_IMAGE = "lahiru2002/backend-app"
        GIT_REPO = "https://github.com/Lahiru-code/devops-project.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend"
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend"
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}
*/
  pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "179707674384"

        FRONTEND_IMAGE = "bookstore-frontend"
        BACKEND_IMAGE  = "bookstore-backend"

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                  docker build -t $FRONTEND_IMAGE:latest frontend
                  docker build -t $BACKEND_IMAGE:latest backend
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-ecr-creds'
                ]]) {
                    sh '''
                      aws ecr get-login-password --region $AWS_REGION \
                      | docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        stage('Tag & Push Images to ECR') {
            steps {
                sh '''
                  docker tag $FRONTEND_IMAGE:latest $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                  docker tag $BACKEND_IMAGE:latest  $ECR_REGISTRY/$BACKEND_IMAGE:latest

                  docker push $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                  docker push $ECR_REGISTRY/$BACKEND_IMAGE:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
