pipeline {
    agent any
    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = credentials('aws-account-id') 
        ECR_FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/taxeasyfile/taxeasyfile-frontend"
        ECR_BACKEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/taxeasyfile/taxeasyfile-backend"
        ECS_CLUSTER = 'TaxEasyFileCluster'
        ECS_FRONTEND_SERVICE = 'taxeasyfile-frontend-service'
        ECS_BACKEND_SERVICE = 'taxeasyfile-backend-service'
        FRONTEND_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:070021538304:frontend-ecs-deployment-status'
        BACKEND_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:070021538304:backend-ecs-deployment-status'
    }
    stages {
        stage('Build Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh '''
                        echo "Current directory: $(pwd)"
                        npm install
                        npm run build
                    '''
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh 'npm test'
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('taxeasyfile-backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('taxeasyfile-backend') {
                    sh 'mvn test'
                }
            }
        }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('taxeasyfile-sonar') {
                    dir('taxeasyfile-backend') {
                        sh 'mvn sonar:sonar -Dsonar.projectKey=TaxEasyFile'
                    }
                    dir('taxeasyfile-frontend') {
                        sh 'npm install sonar-scanner --save-dev'
                        sh 'npx sonar-scanner -Dsonar.projectKey=TaxEasyFile -Dsonar.sources=src'
                    }
                }
            }
        }
        stage('Security Scan') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh 'docker build -t taxeasyfile-frontend .'
                    sh 'docker scan taxeasyfile-frontend:latest || true'
                }
                dir('taxeasyfile-backend') {
                    sh 'docker build -t taxeasyfile-backend .'
                    sh 'docker scan taxeasyfile-backend:latest || true'
                }
            }
        }
        stage('Push Docker Images to ECR') {
            steps {
                withAWS(credentials: 'taxeasyfile-aws-credentials', region: "${AWS_REGION}") {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker build -t taxeasyfile-frontend ./taxeasyfile-frontend
                        docker tag taxeasyfile-frontend:latest ${ECR_FRONTEND_REPO}:latest
                        docker push ${ECR_FRONTEND_REPO}:latest
                        docker build -t taxeasyfile-backend ./taxeasyfile-backend
                        docker tag taxeasyfile-backend:latest ${ECR_BACKEND_REPO}:latest
                        docker push ${ECR_BACKEND_REPO}:latest
                    '''
                }
            }
        }
        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'taxeasyfile-aws-credentials', region: "${AWS_REGION}") {
                    sh '''
                        aws ecs update-service \
                          --cluster ${ECS_CLUSTER} \
                          --service ${ECS_FRONTEND_SERVICE} \
                          --force-new-deployment
                        aws ecs update-service \
                          --cluster ${ECS_CLUSTER} \
                          --service ${ECS_BACKEND_SERVICE} \
                          --force-new-deployment
                    '''
                }
            }
        }
    }
    post {
        success {
            withAWS(credentials: 'taxeasyfile-aws-credentials', region: "${AWS_REGION}") {
                echo '✅ Deployment successful, sending SNS notifications...'
                snsPublish topicArn: "${FRONTEND_SNS_TOPIC_ARN}", message: "Frontend ECS deployment succeeded", subject: "Deployment Success"
                snsPublish topicArn: "${BACKEND_SNS_TOPIC_ARN}", message: "Backend ECS deployment succeeded", subject: "Deployment Success"
            }
        }
        failure {
            withAWS(credentials: 'taxeasyfile-aws-credentials', region: "${AWS_REGION}") {
                echo '❌ Deployment failed, sending SNS notifications...'
                snsPublish topicArn: "${FRONTEND_SNS_TOPIC_ARN}", message: "Frontend ECS deployment failed", subject: "Deployment Failure"
                snsPublish topicArn: "${BACKEND_SNS_TOPIC_ARN}", message: "Backend ECS deployment failed", subject: "Deployment Failure"
            }
        }
        always {
            cleanWs()
        }
    }
}