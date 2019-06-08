sync:
	@docker-sync start

shell:
	@docker-compose run -p 3000:3000 takebot bash

stop-sync:
	@docker-sync stop

down:
	@docker-compose down

redis:
	@redis-cli -u redis://127.0.0.1:16379

start: sync shell
stop: stop-sync down
