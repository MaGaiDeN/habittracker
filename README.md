# HabitTracker

Una aplicación full-stack para el seguimiento de hábitos y desarrollo personal.

## Características Destacadas

### Modal de Reflexión
- Se abre al pulsar en cualquier día
- Diseño dividido en dos columnas
- Campos inspirados en el documento original "Disolviendo el Ego"

### Secciones del Modal
- **Preguntas de Contemplación**: Espacio para reflexión profunda
- **Lista de Creencias a Cuestionar**: Identificación de patrones
- **Atajos de Transformación**: Herramientas prácticas

### Características Interactivas
- Textarea para escribir reflexiones
- Checkboxes para creencias
- Botón de cierre
- Diseño responsive

### Estética
- Mantiene el estilo de la aplicación
- Colores suaves
- Iconografía de Lucide

El modal permite una reflexión profunda y consciente para cada día del reto, siguiendo el espíritu del documento original "Disolviendo el Ego".

## Tecnologías

### Backend
- Node.js con Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticación

### Frontend
- Next.js 15
- React 18
- TailwindCSS
- React Query
- Zustand para estado global

## Estructura del Proyecto 
habittracker/
├── backend/ # Servidor Express
├── frontend/ # Aplicación Next.js
└── package.json # Scripts globales

## Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Configuración

1. Clona el repositorio:
bash
git clone https://github.com/MaGaiDeN/habittracker.git
cd habittracker

2. Instala las dependencias:
bash
npm install
cd backend && npm install
cd ../frontend && npm install

3. Configura las variables de entorno:

Backend (.env):
bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/habittracker"
JWT_SECRET="tu_secreto_jwt"
PORT=3001

Frontend (.env):
bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api

4. Inicializa la base de datos:
bash
cd backend
npx prisma migrate dev

## Desarrollo

Inicia ambos servidores simultáneamente:
bash
npm run dev

O individualmente:

Backend:
bash
cd backend
npm run dev

Frontend:
bash
cd frontend
npm run dev

## Endpoints API

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios
- `GET /api/trackers` - Obtener trackers del usuario
- `POST /api/trackers` - Crear nuevo tracker

## Características

- Autenticación de usuarios
- Creación y seguimiento de hábitos
- Estadísticas de progreso
- Interfaz responsive
- Persistencia de datos
- Protección de rutas

## Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto

Carlos Sánchez - [SLR](https://sientelared.com)

Link del proyecto: [https://github.com/MaGaiDeN/habittracker](https://github.com/MaGaiDeN/habittracker)