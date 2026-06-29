.PHONY: build up down logs migrate test clean

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	docker-compose exec backend npm run migrate

test:
	docker-compose exec backend npm test

clean:
	docker-compose down -v
	docker system prune -f

status:
	docker-compose ps