pipeline {
    agent any
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO_FRONTEND = '070021538304.dkr.ecr.us-east-1.amazonaws.com/taxeasyfile/frontend'
        ECR_REPO_BACKEND = '070021538304.dkr.ecr.us-east-1.amazonaws.com/taxeasyfile/backend'
        ECS_CLUSTER = 'taxeasyfile'
        ECS_SERVICE_FRONTEND = 'taxeasyfile-frontend-service'
        ECS_SERVICE_BACKEND = 'taxeasyfile-backend-service'
        ECS_TASK_DEFINITION_FRONTEND = 'frontend-task-def'
        ECS_TASK_DEFINITION_BACKEND = 'backend-task-def'
        AURORA_SECRET_ARN = 'arn:aws:secretsmanager:us-east-1:070021538304:secret:taxeasyfile-aurora-credentials-cRlZko'
    }
    tools {
        maven 'Maven'
        nodejs 'NodeJS'
    }
    stages {
        stage('Build Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    script {
                        withEnv(["PATH+NODE=${tool 'NodeJS'}/bin"]) {
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                    script {
                        withCredentials([aws(credentialsId: 'awsCred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                            bat "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin 070021538304.dkr.ecr.us-east-1.amazonaws.com"
                            bat "docker build -t ${ECR_REPO_FRONTEND}:${BUILD_NUMBER} ."
                            bat "docker push ${ECR_REPO_FRONTEND}:${BUILD_NUMBER}"
                        }
                    }
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('taxeasyfile-backend') {
                    bat 'mvn clean package -DskipTests'
                    script {
                        withCredentials([aws(credentialsId: 'awsCred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                            bat "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin 070021538304.dkr.ecr.us-east-1.amazonaws.com"
                            bat "docker build -t ${ECR_REPO_BACKEND}:${BUILD_NUMBER} ."
                            bat "docker push ${ECR_REPO_BACKEND}:${BUILD_NUMBER}"
                        }
                    }
                }
            }
        }
        stage('Security Scan') {
            steps {
                bat "trivy image ${ECR_REPO_FRONTEND}:${BUILD_NUMBER}"
                bat "trivy image ${ECR_REPO_BACKEND}:${BUILD_NUMBER}"
                bat "scout aws --report-dir scout-reports"
                archiveArtifacts artifacts: 'scout-reports/**'
            }
        }
        stage('Deploy Frontend to ECS') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'awsCred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        ecsDeploy taskDefinition: "${ECS_TASK_DEFINITION_FRONTEND}", serviceName: "${ECS_SERVICE_FRONTEND}", clusterName: "${ECS_CLUSTER}", containerName: 'frontend-container', image: "${ECR_REPO_FRONTEND}:${BUILD_NUMBER}", region: "${AWS_REGION}"
                    }
                }
            }
        }
        stage('Deploy Backend to ECS') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'awsCred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        def secret = awsSecretsManager secretId: "${AURORA_SECRET_ARN}", region: "${AWS_REGION}", credentialsId: 'awsCred'
                        def secretJson = readJSON text: secret.secretString
                        ecsDeploy taskDefinition: "${ECS_TASK_DEFINITION_BACKEND}", serviceName: "${ECS_SERVICE_BACKEND}", clusterName: "${ECS_CLUSTER}", containerName: 'backend-container', image: "${ECR_REPO_BACKEND}:${BUILD_NUMBER}", environment: [SPRING_DATASOURCE_URL: "jdbc:mysql://${secretJson.host}:${secretJson.port}/${secretJson.dbname}", SPRING_DATASOURCE_USERNAME: "${secretJson.username}", SPRING_DATASOURCE_PASSWORD: "${secretJson.password}"], region: "${AWS_REGION}"
                    }
                }
            }
        }
    }
}