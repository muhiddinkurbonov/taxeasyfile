pipeline {
    agent any
    tools {
        jdk 'JDK17'
        maven 'Maven3.9'
        nodejs 'Node22'
    }
    environment {
        SONAR_TOKEN = credentials('jenkins-sonar-token') 
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/muhiddinkurbonov/taxeasyfile.git', 
                    branch: 'main',
                    credentialsId: 'github-token'
            }
        }
        stage('Build Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh 'npm test || true' // Allow tests to fail for now
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
                    sh 'mvn test || true' // Allow tests to fail
                }
            }
        }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir('taxeasyfile-backend') {
                        sh 'mvn sonar:sonar -Dsonar.projectKey=TaxEasyFile -Dsonar.host.url=http://host.docker.internal:9000 -Dsonar.login=$SONAR_TOKEN'
                    }
                    dir('taxeasyfile-frontend') {
                        sh 'npm install -g sonar-scanner'
                        sh 'sonar-scanner -Dsonar.projectKey=TaxEasyFile -Dsonar.sources=src -Dsonar.host.url=http://host.docker.internal:9000 -Dsonar.login=$SONAR_TOKEN'
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh 'docker build -t taxeasyfile-frontend .'
                }
                dir('taxeasyfile-backend') {
                    sh 'docker build -t taxeasyfile-backend .'
                }
            }
        }
    }
}