# Сервер и деплой

## Сервер

Selectel VDS 2 vCPU / 4 ГБ / 50 ГБ NVMe, Ubuntu 24.04, IP `135.106.227.165`.

Сервер **общий**: на нём работает сервер подписок Remnawave — compose-проект
`subpage` в `/opt/subpage`. Его Caddy занимает порты 80/443 на единственном IP
(второй IP для VDS Selectel не выдаёт) и служит общей входной дверью.

Сайт: **https://site.mastertrans.tk**

```
посетитель ──443/TLS──▶ caddy (Remnawave, правит хаб флота)
                          │ site_net, HTTP
                          ▼
                   mastertrans-caddy-1:80 ──edge──▶ app:3000 ──backend──▶ db
```

TLS и сертификат для `site.mastertrans.tk` — на стороне Caddy подписки, его
конфиг ведёт хаб. Наш Caddy слушает только `:80` внутри Docker и не публикует
ни одного порта на хосте.

## Правила общего сервера

Нарушение любого пункта может положить VPN-подписки.

- Не трогать `/opt/subpage`, контейнеры `caddy`, `subscription-page`, `subcache`,
  сеть `subpage_web`, тома `subpage_*`.
- Никогда не запускать `docker system prune`, `docker image prune -a`,
  `docker volume prune`: они удалят и чужое.
- Не перезапускать `docker.service` и не править `/etc/docker/daemon.json` —
  перезапуск демона перезапустит контейнеры Remnawave.
- compose-команды — только из `/opt/stacks/mastertrans` (проект `mastertrans`).
- Не трогать `/root/.ssh/authorized_keys` (там ключ мониторинга хаба `svc-probe`)
  и `/etc/ssh/sshd_config.d/00-fleet.conf`.
- Не удалять сеть `site_net` и не переименовывать контейнер
  `mastertrans-caddy-1` (сервис `caddy` проекта `mastertrans`): хаб проксирует
  на него по этому имени.

## Раскладка

| Путь | Что |
|---|---|
| `/opt/mastertrans/src` | git-клон ветки `next-site`, из него идёт сборка |
| `/opt/stacks/mastertrans` | `compose.yaml` и `Caddyfile` (копируются из репо при деплое), `.env` с секретами — только здесь, права 600 |
| `/opt/dockge` | панель управления |

## Деплой

```bash
ssh root@135.106.227.165 'bash /opt/mastertrans/src/deploy/deploy.sh'
```

Скрипт забирает свежий `next-site`, собирает образы в отдельном buildx-сборщике
с потолком 1 CPU / 2 ГБ (VPN не страдает от сборки), применяет миграции БД,
перезапускает стек с ожиданием healthcheck и удаляет старые образы проекта,
оставляя три последние сборки. Откат — запустить скрипт на нужном коммите
или ветке.

## Панель управления

Панель Dockge слушает только `127.0.0.1:5001` сервера, вход — через SSH-туннель.
Добавьте в `~/.ssh/config`:

```
Host mastertrans
  HostName 135.106.227.165
  User root
  LocalForward 5001 127.0.0.1:5001
```

Затем `ssh -N mastertrans` и откройте http://localhost:5001. При первом входе
панель попросит создать учётную запись администратора.

Dockge управляет только стеками из `/opt/stacks`. Remnawave виден в списке со
статусом, но кнопок запуска и остановки для него нет.

## Безопасность

- **ufw**: входящие запрещены, открыты 22, 80, 443 (последние два — Caddy
  подписки). Docker публикует порты в обход ufw, поэтому наш стек не публикует
  ничего, а Dockge слушает только `127.0.0.1`.
- **Реальные IP**: наш Caddy доверяет `X-Forwarded-For` только из частных подсетей
  (`trusted_proxies static private_ranges`), то есть от Caddy подписки по
  `site_net`. Журнал запросов: `docker compose logs caddy`, поле `client_ip`.
- **fail2ban** (SSH): 5 неудач за 10 минут — бан на час, при повторах до недели.
  Хаб флота `159.195.78.127` в белом списке.
- **sshd**: вход только по ключу (задано `00-fleet.conf`), X11 отключён,
  `LoginGraceTime 30` — наш drop-in `10-mastertrans.conf`.
- **Контейнеры**: лимиты памяти и CPU, `no-new-privileges`, сброшенные
  capabilities, приложение с read-only файловой системой; база и бэкапы в
  сети без выхода в интернет.
- **Обновления**: unattended-upgrades ставит security-патчи Ubuntu, автоматической
  перезагрузки нет.

## Лимиты ресурсов

| Сервис | Память | CPU |
|---|---|---|
| app | 512 МБ | 1.0 |
| db | 512 МБ | 1.0 |
| caddy | 128 МБ | 0.5 |
| db-backup | 128 МБ | 0.5 |
| dockge | 256 МБ | 0.5 |
| сборщик (только во время деплоя) | 2 ГБ | 1.0 |

Remnawave в покое занимает около 265 МБ.

## Бэкапы

`db-backup` раз в сутки делает `pg_dump` в том `mastertrans_db-backups`:
7 дневных, 4 недельных, 6 месячных копий.

Восстановление из последнего дампа:

```bash
cd /opt/stacks/mastertrans
docker compose exec db-backup ls /backups/last
docker compose exec -T db-backup sh -c \
  'gunzip -c /backups/last/mastertrans-latest.sql.gz' \
  | docker compose exec -T db psql -U mastertrans -d mastertrans
```

Копии лежат на том же сервере. Следующий шаг — выгрузка в Selectel S3.

## Известные риски общей схемы

- Сайт доступен, только пока работает Caddy подписки и в его конфиге есть блок
  `site.mastertrans.tk`. Если хаб перегенерирует конфиг без блока, пропадёт
  только сайт, подписки не пострадают.
- Сайт и подписки делят IP: блокировка адреса затронет оба сервиса.
