# Docker Compose - SGCV2

Este archivo configura los servicios necesarios para el desarrollo local.

## Servicios Disponibles

### PostgreSQL (Siempre activo)

- **Puerto:** 5432
- **Usuario:** postgres
- **Contraseña:** postgres
- **Base de datos:** sgcv2
- **Inicialización:** Los scripts SQL en `/database` se ejecutan automáticamente al crear el contenedor

### pgAdmin (Opcional)

- **Puerto:** 5050
- **Email:** admin@sgcv2.local
- **Contraseña:** admin
- **Uso:** Interfaz web para administrar PostgreSQL

## Comandos

### Iniciar servicios básicos (solo PostgreSQL)

```bash
docker-compose up -d
```

### Iniciar con pgAdmin

```bash
docker-compose --profile tools up -d
```

### Ver logs

```bash
docker-compose logs -f postgres
```

### Detener servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ BORRA TODOS LOS DATOS)

```bash
docker-compose down -v
```

### Reiniciar PostgreSQL

```bash
docker-compose restart postgres
```

### Ejecutar comandos SQL

```bash
docker-compose exec postgres psql -U postgres -d sgcv2
```

### Backup de la base de datos

```bash
docker-compose exec postgres pg_dump -U postgres sgcv2 > backup.sql
```

### Restaurar backup

```bash
docker-compose exec -T postgres psql -U postgres sgcv2 < backup.sql
```

## Conexión desde el Backend

Asegúrate de que tu `.env` tenga:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sgcv2
```

## Conexión desde pgAdmin

1. Abre http://localhost:5050
2. Login con admin@sgcv2.local / admin
3. Agregar servidor:
   - Name: SGCV2 Local
   - Host: postgres (nombre del servicio en Docker)
   - Port: 5432
   - Username: postgres
   - Password: postgres

## Notas

- Los datos se persisten en volúmenes Docker (`postgres_data`)
- El schema se inicializa automáticamente la primera vez
- Si necesitas reiniciar la BD desde cero, usa `docker-compose down -v`
