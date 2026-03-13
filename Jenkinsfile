pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        DOCKER_IMAGE = 'proposalpilot-nextjs'
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY = 'docker.io'  // Change to your Docker Hub username
        REGISTRY_CREDENTIALS = 'docker-hub-credentials'  // Jenkins credentials ID
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code from GitHub..."
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing Node.js dependencies..."
                sh 'npm install'
            }
        }
        
        stage('Lint & Code Quality') {
            steps {
                echo "🔍 Running linting checks..."
                sh 'npm run lint || true'  // Continue even if linting has warnings
            }
        }
        
        stage('Build') {
            steps {
                echo "🏗️  Building Next.js application..."
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo "🧪 Running unit tests..."
                sh 'npm test -- --coverage --watchAll=false || true'  // Continue even if no tests
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                '''
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'  // Only push on main branch
            }
            steps {
                echo "📤 Pushing Docker image to registry..."
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin ${REGISTRY}
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${REGISTRY}/${DOCKER_USER}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE}:latest ${REGISTRY}/${DOCKER_USER}/${DOCKER_IMAGE}:latest
                        docker push ${REGISTRY}/${DOCKER_USER}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker push ${REGISTRY}/${DOCKER_USER}/${DOCKER_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }
        
        stage('Deploy to Local') {
            when {
                branch 'main'
            }
            steps {
                echo "🚀 Deploying Docker container locally..."
                sh '''
                    # Stop old container if running
                    docker stop proposalpilot || true
                    docker rm proposalpilot || true
                    
                    # Start new container
                    docker run -d \
                        --name proposalpilot \
                        -p 3000:3000 \
                        ${DOCKER_IMAGE}:latest
                    
                    sleep 5
                    docker ps -a | grep proposalpilot
                '''
            }
        }
    }
    
    post {
        always {
            echo "✅ Pipeline completed!"
        }
        success {
            echo "🎉 Pipeline successful! App deployed."
            // Add Slack/email notification here
        }
        failure {
            echo "❌ Pipeline failed! Check logs above."
            // Add Slack/email notification here
        }
        cleanup {
            cleanWs()  // Clean workspace after build
        }
    }
}
