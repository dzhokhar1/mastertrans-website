# Сервер и деплой

## Сервер

Selectel VDS 2 vCPU / 4 ГБ / 50 ГБ NVMe, Ubuntu 24.04, IP `135.106.227.165`.

Сервер **общий**: на нём работает сервер подписок Remnawave — compose-проект
`subpage` в `/opt/subpage`. Его Caddy занимает порты 80/443 на единственном IP.
Наш стек живёт рядом полностью независимо.

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

## Доступ к сайту и панели

Пока у сайта нет публичного адреса, он и панель слушают только `127.0.0.1`
сервера. Доступ — через SSH-туннель. Добавьте в `~/.ssh/config`:

```
Host mastertrans
  HostName 135.106.227.165
  User root
  LocalForward 8080 127.0.0.1:8080
  LocalForward 5001 127.0.0.1:5001
```

Затем `ssh -N mastertrans` и в браузере:

- http://localhost:8080 — сайт
- http://localhost:5001 — панель Dockge. При первом входе она попросит создать
  учётную запись администратора.

Dockge управляет только стеками из `/opt/stacks`. Remnawave виден в списке со
статусом, но кнопок запуска и остановки для него нет.

## Безопасность

- **ufw**: входящие запрещены, открыты 22, 80, 443. Docker публикует порты в
  обход ufw, поэтому всё наше слушает `127.0.0.1`, пока не нужно иное.
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

## Публичный запуск

Порты 80/443 на `135.106.227.165` занимает Caddy Remnawave. Варианты:

1. **Второй IPv4** (рекомендуется): наш Caddy слушает свой IP, Remnawave не
   затрагивается совсем. У Selectel VDS дополнительный IP выдаётся по запросу в
   поддержку. После выдачи: прописать IP на интерфейсе, в `.env` задать
   `HTTP_BIND=<IP>:80`, `HTTPS_BIND=<IP>:443`, `SITE_ADDRESS=<домен>` и
   перезапустить стек — Caddy сам выпустит сертификат.
2. **Через Caddy Remnawave**: добавить в их Caddyfile блок нашего домена с
   проксированием на наш Caddy. Бесплатно, но связывает два независимых
   сервиса, а их Caddyfile частично генерируется хабом флота.
