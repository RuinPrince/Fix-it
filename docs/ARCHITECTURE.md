# System Architecture & Diagrams

This document contains Mermaid diagrams illustrating the architecture, data flow, and database schema of the Fix It platform.

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph Clients
        MobileApp[Mobile App - Flutter]
        AdminDash[Admin Dashboard - React/Vite]
    end

    subgraph Load_Balancer
        Nginx[Nginx Reverse Proxy]
    end

    subgraph Backend_Services
        API[Node.js / Express API]
        SocketIO[Socket.IO Server]
    end

    subgraph External_Services
        Firebase[Firebase FCM / Auth / Storage]
        AI[AI Validation Service - Future]
    end

    subgraph Data_Layer
        MySQL[(MySQL 8.0 DB)]
        Redis[(Redis Cache)]
    end

    MobileApp -->|HTTPS / REST| Nginx
    MobileApp -->|WSS| Nginx
    AdminDash -->|HTTPS / REST| Nginx
    AdminDash -->|WSS| Nginx

    Nginx --> API
    Nginx --> SocketIO

    API <--> MySQL
    API <--> Redis
    SocketIO <--> Redis
    
    API <--> Firebase
    API -.->|Planned| AI
```

## 2. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ UserProfile : has
    User ||--o{ Complaint : files
    User ||--o{ AuditLog : creates
    User }|..|{ ReputationBadge : earns
    
    Department ||--o{ Ward : covers
    Department ||--o{ Category : handles
    Department ||--o{ Complaint : assigned_to

    Ward ||--o{ UserProfile : resides_in
    Ward ||--o{ Complaint : location_of

    Category ||--o{ Complaint : categorizes

    Complaint ||--o{ ComplaintImage : contains
    Complaint ||--o{ StatusHistory : tracks
    Complaint ||--o{ Escalation : triggers
    Complaint ||--o{ Feedback : receives
    Complaint ||--o| ChatRoom : has

    ChatRoom ||--o{ ChatMessage : contains

    User {
        int id PK
        string email
        string password_hash
        enum role
        int reputation_points
    }
    
    Complaint {
        int id PK
        string complaint_number
        int citizen_id FK
        int category_id FK
        int ward_id FK
        string status
        string priority
        float latitude
        float longitude
    }

    Department {
        int id PK
        string name
        int head_user_id FK
    }
```

## 3. Complaint Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Submitted: Citizen files complaint
    
    Submitted --> Acknowledged: Admin/System acknowledges
    Submitted --> Rejected: Invalid/Spam
    
    Acknowledged --> Assigned: Assigned to Official/Dept
    
    Assigned --> In_Progress: Official starts work
    
    In_Progress --> Resolved: Issue fixed
    In_Progress --> Assigned: Re-assigned
    
    Resolved --> Closed: Citizen/Admin verifies
    Resolved --> Reopened: Citizen dissatisfied
    
    Reopened --> In_Progress: Rework required
    
    Closed --> [*]
    Rejected --> [*]
```

## 4. Socket.IO Real-Time Flow

```mermaid
sequenceDiagram
    participant Citizen
    participant Express_API
    participant Socket_Server
    participant Official

    Citizen->>Express_API: POST /api/v1/complaints
    Express_API->>MySQL: INSERT Complaint
    Express_API->>Socket_Server: Emit 'NOTIFICATION' event to Dept Head
    Socket_Server-->>Official: Push 'New Complaint Assigned' (WSS)
    
    Official->>Express_API: PUT /api/v1/complaints/:id/status (In Progress)
    Express_API->>MySQL: UPDATE Complaint status
    Express_API->>Socket_Server: Emit 'STATUS_CHANGE' to Citizen ID
    Socket_Server-->>Citizen: Push 'Status Updated to In Progress' (WSS)
    
    Citizen->>Socket_Server: Send Chat Message via WSS
    Socket_Server->>MySQL: Save ChatMessage
    Socket_Server-->>Official: Broadcast new message to ChatRoom
```
