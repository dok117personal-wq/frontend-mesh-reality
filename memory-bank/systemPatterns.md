# System Patterns: Mesh Reality

## Overall Architecture

Mesh Reality follows a distributed microservices architecture with three main components:

```mermaid
flowchart TD
    Client[Frontend: Next.js Website] <--> NextAPI[Next.js API Routes]
    NextAPI <--> BackendAPI[Backend API Service]
    BackendAPI <--> DB[(Database)]
    BackendAPI <--> JobProcessor[Python Job Processor]
    JobProcessor <--> S3[S3 Storage]
    Client <--> S3
    
    style Client fill:#f9f9f9,stroke:#333,stroke-width:2px
    style NextAPI fill:#d1e7dd,stroke:#333,stroke-width:2px
    style BackendAPI fill:#d1e7dd,stroke:#333,stroke-width:2px
    style JobProcessor fill:#cff4fc,stroke:#333,stroke-width:2px
    style DB fill:#f8d7da,stroke:#333,stroke-width:2px
    style S3 fill:#f8d7da,stroke:#333,stroke-width:2px
```

1. **Frontend (mesh-reality-website)**
   - Next.js 14 web application
   - User interface for all tools and services
   - Client-side model viewing with Three.js
   - Authentication flow integration

2. **Backend API (mesh-reality-backend)**
   - RESTful API service
   - User and model data management
   - Authentication and authorization
   - Job management API

3. **Python Job Processor (mesh-reality-hunyuan3d)**
   - Asynchronous processing of 3D generation tasks
   - Machine learning model integration
   - Background job processing
   - Media processing (images, GIFs, etc.)

## Core Pattern: Job Queue Architecture

The system employs a job queue architecture for handling computationally intensive 3D model generation:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAPI as Next.js API
    participant BackendAPI
    participant Database
    participant PythonProcessor as Python Job Processor
    participant S3

    User->>Frontend: Uploads images/text
    Frontend->>NextAPI: Submit generation request
    NextAPI->>BackendAPI: Forward request
    BackendAPI->>Database: Create job record (PENDING)
    BackendAPI->>Frontend: Return jobId
    Frontend->>User: Show processing status
    
    loop Polling
        PythonProcessor->>Database: Poll for PENDING jobs
        Database->>PythonProcessor: Return job details
        PythonProcessor->>Database: Update job status (PROCESSING)
        PythonProcessor->>PythonProcessor: Generate 3D model
        PythonProcessor->>S3: Upload model & preview GIF
        PythonProcessor->>Database: Update job status (COMPLETED)
    end
    
    loop Status Checking
        Frontend->>BackendAPI: Poll job status
        BackendAPI->>Database: Get job status
        BackendAPI->>Frontend: Return current status
        Frontend->>User: Update progress UI
    end
    
    Frontend->>S3: Fetch completed model
    Frontend->>User: Display 3D model
```

### Benefits of Job Queue Pattern
- Decouples request handling from intensive processing
- Prevents API timeouts during long-running operations
- Enables real-time status updates to users
- Allows for background processing of resource-intensive tasks
- Facilitates better error handling and recovery
- Provides a 360-degree preview GIF while full model loads

## Authentication Flow

Authentication is backend-owned; frontend uses session cookie.

```mermaid
flowchart TD
    Start[User Arrives] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| AuthMethods[Auth Methods]
    AuthMethods --> Phone[Phone OTP]
    AuthMethods --> Google[Google OAuth]
    AuthMethods --> Apple[Apple OAuth]
    
    Phone --> Backend[Backend API]
    Google --> Backend
    Apple --> Backend
    
    Backend --> Supabase[Supabase Auth]
    Supabase --> Cookie[Set HTTP-only cookie]
    Cookie --> Redirect[Redirect to Dashboard]
    
    AuthCheck -->|Yes| Redirect
    
    style Start fill:#f9f9f9,stroke:#333,stroke-width:2px
    style AuthCheck fill:#cce5ff,stroke:#333,stroke-width:2px
    style Backend fill:#d1e7dd,stroke:#333,stroke-width:2px
    style Redirect fill:#d1e7dd,stroke:#333,stroke-width:2px
```

### Authentication Components
- **Backend**: Session, login, logout, OAuth redirect, phone OTP (Supabase server-side)
- **Phone Auth Flow**: Backend calls Supabase OTP/verify, sets cookie
- **OAuth**: Backend redirects to Supabase → Google/Apple; callback to frontend then POST token to backend
- **Protected Routes**: Dashboard layout checks backend session (cookie)

## Data Flow Patterns

### Model Generation Flow

```mermaid
flowchart LR
    Input[User Input] --> Validation[Input Validation]
    Validation --> JobCreation[Job Creation]
    JobCreation --> Queue[Processing Queue]
    Queue --> Generation[Model Generation]
    Generation --> Preview[Preview Creation]
    Preview --> Storage[S3 Storage]
    Storage --> Viewer[3D Viewer]
    
    style Input fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Generation fill:#cff4fc,stroke:#333,stroke-width:2px
    style Preview fill:#cff4fc,stroke:#333,stroke-width:2px
    style Storage fill:#f8d7da,stroke:#333,stroke-width:2px
    style Viewer fill:#d1e7dd,stroke:#333,stroke-width:2px
```

### User Dashboard Flow

```mermaid
flowchart TD
    Auth[Authenticated User] --> Dashboard[Dashboard]
    Dashboard --> ModelsList[Models List]
    Dashboard --> UploadNew[Upload New]
    Dashboard --> UserSettings[User Settings]
    
    ModelsList --> ViewModel[View Model]
    ModelsList --> DeleteModel[Delete Model]
    ModelsList --> ShareModel[Share Model]
    
    UploadNew --> ToolSelection[Tool Selection]
    ToolSelection --> InputMethod[Input Method]
    InputMethod --> ProcessingFlow[Processing Flow]
    
    style Auth fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Dashboard fill:#d1e7dd,stroke:#333,stroke-width:2px
    style ProcessingFlow fill:#cff4fc,stroke:#333,stroke-width:2px
```

## UI Component Architecture

The frontend follows a component-based architecture with several key patterns:

### Shared Component Pattern

Tools share common UI components to maintain consistency:

```mermaid
flowchart TD
    ToolPage[Tool Page] --> SharedComponents
    
    subgraph SharedComponents[Shared Components]
        FileUpload[File Upload]
        ExampleGallery[Example Gallery]
        ProcessingStatus[Processing Status]
        ModelViewer[Model Viewer]
        HowItWorks[How It Works]
        ExportOptions[Export Options]
    end
    
    ToolPage --> ToolSpecific[Tool-Specific Components]
```

### Authentication Context Pattern

```mermaid
flowchart TD
    AuthProvider[Auth Context Provider] --> App[Application]
    AuthProvider --> AuthState[Authentication State]
    AuthState --> ProtectedRoutes[Protected Routes]
    AuthState --> PublicRoutes[Public Routes]
    AuthState --> ConditionalUI[Conditional UI Elements]
```

## Error Handling Patterns

```mermaid
flowchart TD
    Error[Error Detection] --> Categorization[Error Categorization]
    
    Categorization --> UserErrors[User Input Errors]
    Categorization --> SystemErrors[System Errors]
    Categorization --> ProcessingErrors[Processing Errors]
    
    UserErrors --> ValidationFeedback[Validation Feedback]
    SystemErrors --> Retry[Retry Mechanism]
    ProcessingErrors --> JobFailure[Job Failure Handling]
    
    ValidationFeedback --> UserFix[User Resolution]
    Retry --> BackOff[Exponential Back-off]
    JobFailure --> Notification[User Notification]
    
    style Error fill:#f9f9f9,stroke:#333,stroke-width:2px
    style UserErrors fill:#cce5ff,stroke:#333,stroke-width:2px
    style SystemErrors fill:#f8d7da,stroke:#333,stroke-width:2px
    style ProcessingErrors fill:#fff3cd,stroke:#333,stroke-width:2px
```

## Key Design Patterns Used

1. **Repository Pattern**: For data access abstraction
2. **Service Layer Pattern**: For business logic encapsulation
3. **Job Queue Pattern**: For asynchronous processing
4. **Context Provider Pattern**: For state management in React
5. **Middleware Pattern**: For request/response processing
6. **Factory Pattern**: For creation of different 3D generation strategies
7. **Strategy Pattern**: For swapping 3D generation algorithms
8. **Observer Pattern**: For status updates and notifications

These system patterns form the architectural foundation of Mesh Reality, enabling a scalable, maintainable, and robust platform for 3D content creation.
