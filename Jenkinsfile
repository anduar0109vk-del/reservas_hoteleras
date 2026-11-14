pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 35, unit: 'MINUTES')
    }

    stages {
        stage('Backend tests') {
            steps {
                sh 'chmod +x mvnw'
                sh './mvnw -B verify'
            }
        }

        stage('Frontend lint and build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }

        stage('Selenium browser test') {
            steps {
                sh '''
                    docker run -d --rm --name reservas-selenium -p 4444:4444 selenium/standalone-chrome:4
                    cd frontend
                    ./node_modules/.bin/vite --host 0.0.0.0 > ../frontend-ci.log 2>&1 &
                    echo $! > ../frontend-ci.pid
                    cd ..
                    for attempt in $(seq 1 30); do
                      if curl --fail --silent http://127.0.0.1:5171/login > /dev/null; then break; fi
                      sleep 2
                    done
                    curl --fail --silent http://127.0.0.1:5171/login > /dev/null
                    for attempt in $(seq 1 30); do
                      if curl --fail --silent http://127.0.0.1:4444/status > /dev/null; then break; fi
                      sleep 2
                    done
                    curl --fail --silent http://127.0.0.1:4444/status > /dev/null
                '''
                withEnv(['SELENIUM_REMOTE_URL=http://127.0.0.1:4444/wd/hub', 'SELENIUM_BASE_URL=http://127.0.0.1:5171/login']) {
                    sh './mvnw -B -Pselenium verify'
                }
            }
            post {
                always {
                    sh 'if [ -f frontend-ci.pid ]; then kill "$(cat frontend-ci.pid)" || true; rm -f frontend-ci.pid; fi'
                    sh 'docker rm -f reservas-selenium || true'
                }
            }
        }

        stage('Container configuration') {
            steps {
                sh 'docker compose --env-file .env.example config --quiet'
                sh 'docker compose --env-file .env.example build'
            }
        }
    }

    post {
        always {
            junit testResults: '**/target/surefire-reports/*.xml, **/target/failsafe-reports/*.xml', allowEmptyResults: true
        }
    }
}
