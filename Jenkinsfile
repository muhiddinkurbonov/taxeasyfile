pipeline {
    agent any
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
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    bat 'npm test || true' 
                }
            }
        }
        stage('Build Backend') {
            steps {
                dir('taxeasyfile-backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('taxeasyfile-backend') {
                    bat 'mvn test || true' 
                }
            }
        }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir('taxeasyfile-backend') {
                        bat 'mvn sonar:sonar -Dsonar.projectKey=TaxEasyFile -Dsonar.host.url=http://localhost:9000 -Dsonar.login=$SONAR_TOKEN'
                    }
                    dir('taxeasyfile-frontend') {
                        bat 'npm install -g sonar-scanner'
                        bat 'sonar-scanner -Dsonar.projectKey=TaxEasyFile -Dsonar.sources=src -Dsonar.host.url=http://localhost:9000 -Dsonar.login=$SONAR_TOKEN'
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                dir('taxeasyfile-frontend') {
                    bat 'docker build -t taxeasyfile-frontend .'
                }
                dir('taxeasyfile-backend') {
                    bat 'docker build -t taxeasyfile-backend .'
                }
            }
        }
    }
}