// 

pipeline {
    agent any
    stages {
        stage('Test ECS Deploy') {
            steps {
                withCredentials([aws(credentialsId: 'awsCred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    ecsDeploy(
                        clusterName: 'taxeasyfile',
                        serviceName: 'taxeasyfile-frontend-service',
                        image: '070021538304.dkr.ecr.us-east-1.amazonaws.com/taxeasyfile/frontend:33',
                        region: 'us-east-1'
                    )
                }
            }
        }
    }
}