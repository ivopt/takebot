sync:
	@docker-sync start

stop-sync:
	@docker-sync stop

shell:
	@docker-compose run -p 3000:3000 -p 1234:1234 -p 2345:2345 takebot bash

fe-shell:
	@docker-compose run -p 1234:1234 -p 2345:2345 takebot bash

be-shell:
	@docker-compose run -p 3000:3000 takebot bash

down:
	@docker-compose down

redis:
	@redis-cli -u redis://127.0.0.1:16379

start: sync shell
stop: stop-sync down

fe-start: sync fe-shell
be-start: sync be-shell
