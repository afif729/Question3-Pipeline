pipeline {
    agent any
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: 'v1.0', description: 'Docker Image Tag/Version')
        booleanParam(name: 'AUTO_ROLLBACK', defaultValue: true, description: 'Rollback on failure')
    }
    environment {
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
        DOCKER_IMAGE = "afif729/advanced-app:${params.IMAGE_TAG}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Run Unit Tests') {
            steps {
                bat 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }
        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat 'docker login -u %USER% -p %PASS%'
                    bat 'docker push %DOCKER_IMAGE%'
                }
            }
        }
        stage('Deploy Rolling Update') {
            steps {
                withCredentials([file(credentialsId: 'kuberconfig', variable: 'KUBECONFIG')]) {
                    bat '''
                        set KUBECONFIG=%KUBECONFIG%
                        kubectl apply -f k8s-deployment.yaml --validate=false
                        kubectl set image deployment/advanced-app-deployment advanced-app=%DOCKER_IMAGE%
                        kubectl rollout status deployment/advanced-app-deployment
                    '''
                }
            }
        }
    }
    post {
        failure {
            script {
                if (params.AUTO_ROLLBACK) {
                    echo 'Deployment failed! Triggering automatic rollback...'
                    withCredentials([file(credentialsId: 'kuberconfig', variable: 'KUBECONFIG')]) {
                        bat '''
                            set KUBECONFIG=%KUBECONFIG%
                            kubectl rollout undo deployment/advanced-app-deployment
                        '''
                    }
                }
            }
        }
    }
}