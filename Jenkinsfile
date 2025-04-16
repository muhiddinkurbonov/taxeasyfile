pipeline {
    agent any
    stages {
        stage('Build Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    sh '''
                        #!/bin/bash
                        echo "Current directory: $(pwd)"
                        echo "Running npm install..."
                        npm install
                        echo "Running npm run build..."
                        npm run build
                    '''
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('taxeasyfile-frontend') {
                    bat 'npm test' 
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
        // stage('Test Backend') {
        //     steps {
        //         dir('taxeasyfile-backend') {
        //             bat 'mvn test || true' 
        //         }
        //     }
        // }
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('taxeasyfile-sonar') {
                    dir('taxeasyfile-backend') {
                        bat 'mvn sonar:sonar -Dsonar.projectKey=TaxEasyFile'
                    }
                    dir('taxeasyfile-frontend') {
                        bat 'npm install sonar-scanner --save-dev'
                        bat 'npx sonar-scanner -Dsonar.projectKey=TaxEasyFile -Dsonar.sources=src'
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