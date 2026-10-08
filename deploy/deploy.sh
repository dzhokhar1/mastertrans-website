#!/usr/bin/env bash
# Сборка и выкладка сайта. Запуск на сервере:
#   bash /opt/mastertrans/src/deploy/deploy.sh [ветка]
set -euo pipefail

SRC=/opt/mastertrans/src
STACK=/opt/stacks/mastertrans
BRANCH=${1:-next-site}
BUILDER=mastertrans-builder

cd "$SRC"
git fetch -q origin "$BRANCH"
git checkout -q -f -B "$BRANCH" "origin/$BRANCH"
TAG=$(git rev-parse --short HEAD)
echo "==> deploying $BRANCH @ $TAG"

# Сборка в отдельном контейнере с потолком 1 CPU / 2 ГБ: на сервере
# работает VPN-сервис, сборка не должна отнимать у него ресурсы.
if ! docker buildx inspect "$BUILDER" >/dev/null 2>&1; then
  docker buildx create --name "$BUILDER" --driver docker-container \
    --driver-opt cpu-period=100000 --driver-opt cpu-quota=100000 \
    --driver-opt memory=2g --driver-opt memory-swap=2g >/dev/null
fi
trap 'docker buildx stop "$BUILDER" >/dev/null 2>&1 || true' EXIT
docker buildx build --builder "$BUILDER" --load --target migrator \
  -t "mastertrans-migrate:$TAG" -t mastertrans-migrate:latest .
docker buildx build --builder "$BUILDER" --load --target runner \
  -t "mastertrans-app:$TAG" -t mastertrans-app:latest .
docker buildx stop "$BUILDER"

install -d -m 750 "$STACK"
install -m 644 deploy/compose.yaml "$STACK/compose.yaml"
install -m 644 deploy/Caddyfile "$STACK/Caddyfile"
if [ ! -f "$STACK/.env" ]; then
  echo "!! $STACK/.env не найден — создайте из deploy/.env.example" >&2
  exit 1
fi

cd "$STACK"
docker compose up -d --wait db
docker compose run --rm migrate
docker compose up -d --wait --remove-orphans

# --wait не ловит контейнер, который упал сразу после старта и ушёл в рестарт.
sleep 10
bad=$(docker compose ps --all --format '{{.Service}} {{.State}}' | awk '$2 != "running"')
if [ -n "$bad" ]; then
  echo "!! сервисы не в состоянии running:" >&2
  echo "$bad" >&2
  exit 1
fi

# Чистим только свои образы: оставляем 3 последние сборки.
for repo in mastertrans-app mastertrans-migrate; do
  docker images "$repo" --format '{{.Tag}}' | grep -vx latest | tail -n +4 \
    | xargs -r -I{} docker rmi "$repo:{}" >/dev/null 2>&1 || true
done

echo "==> done: $TAG"
docker compose ps --format 'table {{.Service}}\t{{.Status}}'
