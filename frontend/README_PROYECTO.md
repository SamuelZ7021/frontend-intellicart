# Intellicart Platform 🛒

> Plataforma de comercio electrónico moderna con inteligencia artificial

---

## 📖 ¿Qué es esto?

**Intellicart** es una plataforma de e-commerce completa que permite a cualquier negocio vender productos online con una experiencia personalizada impulsada por Machine Learning.

### El Problema que Resolvemos

| Problema | Solución |
|----------|----------|
| Los clientes abandonan el carrito | Checkout optimizado en 3 pasos |
| No hay personalización | Recomendaciones ML en tiempo real |
| No se conoce al cliente | Analytics detallado y segmentación |
| El sistema colapsa en picos | Arquitectura cloud auto-escalable |

---

## 🎯 Funcionalidades Principales

### Para Clientes
- 🛍️ **Catálogo** con búsqueda inteligente y filtros
- 🤖 **Recomendaciones personalizadas** ("Para ti", "Similares", "Juntos")
- 🛒 **Carrito persistente** entre sesiones
- ⚡ **Checkout rápido** en 3 pasos
- 📦 **Tracking de envíos** en tiempo real
- ⭐ **Reviews y ratings** de productos

### Para Administradores
- 📊 **Dashboard** con métricas en tiempo real
- 📦 **Gestión de productos** e inventario
- 👥 **Base de clientes** con segmentación
- 📈 **Reportes** de ventas y comportamiento
- 🎫 **Cupones y promociones**

### Inteligencia Artificial
- 🧠 **Motor de recomendaciones** (aumenta ventas 30%)
- 📉 **Predicción de demanda** para inventario
- 😊 **Análisis de sentimiento** en reviews
- 🎯 **Segmentación automática** de clientes

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTES                                  │
│  Web (React)  │  Mobile  │  Third Parties                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 AWS API GATEWAY                              │
│         (Auth, Rate Limiting, WAF)                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  USER SVC    │   │  ORDER SVC   │   │  ML SVC      │
│  (Java)      │   │  (Java)      │   │  (Python)    │
│              │   │              │   │              │
│  • Auth      │   │  • Carrito   │   │  • ML Model  │
│  • Perfiles  │   │  • Checkout  │   │  • Predict   │
│  • JWT       │   │  • Órdenes   │   │  • Recommend │
└──────────────┘   └──────────────┘   └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  PostgreSQL  │   │  Redis       │   │  Kafka       │
│  (Datos)     │   │  (Cache)     │   │  (Eventos)   │
└──────────────┘   └──────────────┘   └──────────────┘
```

### Por qué Multi-Lenguaje?

| Servicio | Lenguaje | Razón |
|----------|----------|-------|
| API Gateway, User, Order | **Java** | Transacciones seguras, alta concurrencia |
| ML/Recomendaciones | **Python** | Librerías ML (scikit-learn, pandas) |
| Frontend | **React + TS** | Experiencia de usuario moderna |

---

## 🚀 Tecnologías

### Backend (Java)
- **Spring Boot 3.2** + Java 21 (Virtual Threads)
- **Spring Security** + JWT
- **PostgreSQL** + **Redis**
- **Apache Kafka** (eventos)
- **gRPC** (comunicación interna)
- **Resilience4j** (circuit breaker)

### Backend (Python)
- **FastAPI** (API async)
- **scikit-learn** (ML)
- **pandas/numpy** (datos)
- **gRPC client**

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS**
- **Zustand** (estado)
- **TanStack Query** (data fetching)

### Infraestructura
- **Docker** + Docker Compose
- **AWS ECS Fargate** (containers)
- **AWS RDS** (PostgreSQL)
- **AWS MSK** (Kafka)
- **Terraform** (IaC)
- **Jaeger** (tracing)
- **Grafana** (dashboards)

---

## 📋 Flujo de Compra

```
1. Cliente navega catálogo
        ↓
2. Ve recomendaciones ML ("Para ti")
        ↓
3. Agrega productos al carrito
        ↓
4. Procede a checkout (3 pasos)
   ├─ Paso 1: Dirección
   ├─ Paso 2: Envío
   └─ Paso 3: Pago
        ↓
5. Sistema valida stock (SAGA pattern)
        ↓
6. Procesa pago
        ↓
7. Crea orden y envía confirmación
        ↓
8. Actualiza inventario
        ↓
9. Cliente recibe email + tracking
```

---

## 💻 Estructura del Proyecto

```
mi-ecommerce/
├── 📁 frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Páginas (Home, Product, Cart)
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Zustand stores
│   │   └── api/              # API clients
│   └── package.json
│
├── 📁 services/
│   ├── 📁 user-service/      # Java - Auth y usuarios
│   │   ├── src/main/java/    # Código fuente
│   │   ├── src/main/resources/
│   │   └── pom.xml           # Dependencias Maven
│   │
│   ├── 📁 order-service/     # Java - Órdenes y checkout
│   │   └── ...
│   │
│   └── 📁 ml-service/        # Python - ML y recomendaciones
│       ├── app/
│       │   ├── api/          # Endpoints FastAPI
│       │   ├── core/         # Configuración
│       │   └── infrastructure/
│       ├── models/           # Modelos ML entrenados
│       └── requirements.txt
│
├── 📁 proto/                 # Protocol Buffers (gRPC)
│   ├── user.proto
│   ├── order.proto
│   └── ml.proto
│
├── 📁 infrastructure/
│   ├── terraform/            # Configuración AWS
│   └── docker/               # Configs Docker
│
├── docker-compose.yml        # Infraestructura local
└── Makefile                  # Comandos útiles
```

---

## 🛠️ Setup del Proyecto

### Requisitos
- Docker Desktop
- Java 21+
- Python 3.11+
- Node.js 20+

### 1. Iniciar Infraestructura
```bash
cd mi-ecommerce
docker-compose up -d
```

Esto inicia:
- PostgreSQL (base de datos)
- Redis (cache)
- Kafka (mensajería)
- Jaeger (tracing)
- Grafana (dashboards)

### 2. Iniciar Servicios Java
```bash
cd services/user-service
./mvnw spring-boot:run
```

### 3. Iniciar ML Service (Python)
```bash
cd services/ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

### 4. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev
```

### URLs
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| User API | http://localhost:8081 |
| ML API | http://localhost:8000 |
| ML Docs | http://localhost:8000/docs |
| Jaeger | http://localhost:16686 |
| Grafana | http://localhost:3001 |

---

## 📊 Métricas de Éxito

### Negocio
- **Conversión**: > 3% de visitas que compran
- **Ticket promedio**: > $50
- **Carritos abandonados**: < 60%
- **LTV (Lifetime Value)**: > $200 por cliente

### Técnico
- **Disponibilidad**: 99.9%
- **Latencia p95**: < 500ms
- **Error rate**: < 0.1%

---

## 📅 Roadmap

### Semanas 1-2: Fundamentos
- [x] Setup de proyecto
- [x] Docker Compose
- [x] API Gateway base

### Semanas 3-6: Servicios Core
- [x] User Service (auth, perfiles)
- [x] Order Service (carrito, checkout)
- [x] Frontend básico

### Semanas 7-8: ML Integration
- [x] ML Service (Python)
- [x] Motor de recomendaciones
- [x] Comunicación gRPC

### Semanas 9-10: Event-Driven
- [ ] Kafka integration
- [ ] Patrón SAGA
- [ ] Notificaciones

### Semanas 11-12: Observabilidad
- [ ] OpenTelemetry
- [ ] Jaeger tracing
- [ ] Grafana dashboards

### Semanas 13-14: Producción
- [ ] AWS deployment
- [ ] Load testing
- [ ] Documentación


---

## 📄 Licencia

MIT License - Libre para uso comercial y personal.

---

**Hecho por Samuel Zapata**
