#!/bin/bash

# Запускаем docker-compose с флагом --build
docker-compose up --build -d

# Удаляем старые образы
docker image prune -f
