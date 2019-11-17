start-sync:
	@DOCKER_SYNC_SKIP_UPGRADE=true DOCKER_SYNC_SKIP_UPDATE=true DOCKER_SYNC_SKIP_DEPENDENCIES_CHECK=true docker-sync start

stop-sync:
	@DOCKER_SYNC_SKIP_UPGRADE=true DOCKER_SYNC_SKIP_UPDATE=true DOCKER_SYNC_SKIP_DEPENDENCIES_CHECK=true docker-sync stop

shell:
	@docker-compose run -p 3000:3000 -p 1234:1234 -p 2345:2345 takebot bash

fe-shell:
	@docker-compose run -p 1234:1234 -p 2345:2345 takebot bash

be-shell:
	@docker-compose run -p 3000:3000 -p 9229:9229 takebot bash

down:
	@docker-compose down

redis:
	@redis-cli -u redis://127.0.0.1:16379

start: start-sync shell
stop: stop-sync down

fe-start: start-sync fe-shell
be-start: start-sync be-shell
