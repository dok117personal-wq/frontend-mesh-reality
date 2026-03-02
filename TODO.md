# Model Generation Job Queue Implementation TODO

## Python API Tasks (mesh-reality-hunyuan3d)

- [x] Add database connectivity to the Python model server
  - [x] Install required packages (mysql-connector-python, boto3)
  - [x] Configure database connection
  - [x] Implement job polling function
  - [x] Add S3 upload functionality

- [x] Add 360-degree preview GIF generation
  - [x] Implement rendering function using pyrender or another suitable library
  - [x] Add GIF creation from rendered frames
  - [x] Integrate with job processing

- [x] Implement background job processing
  - [x] Create polling thread to check for queued jobs
  - [x] Add error handling and retry logic
  - [x] Implement logging for job processing

## Next.js Backend Tasks (mesh-reality-backend)

### API Endpoints
- [ ] Update `/models/generate` endpoint to create job records
- [ ] Implement job status endpoint `/models/jobs/:jobId`
- [ ] Add authentication and authorization checks

### WebSocket Implementation (Optional)
- [ ] Set up WebSocket server for real-time updates
- [ ] Implement authentication for WebSocket connections
- [ ] Create message handlers for job updates

## Frontend Tasks (mesh-reality-website)

### API Integration
- [x] Update `/api/generate-model/route.ts` to create job records via backend API
- [x] Create job status polling mechanism
- [ ] Implement WebSocket client for real-time updates (if using WebSockets)

### UI Components
- [x] Update photogrammetry component to handle async job processing
- [x] Update model generator component to handle async job processing
- [x] Enhance processing status component to show real-time updates
- [x] Add job status visualization (progress, errors, etc.)
- [x] Add preview GIF display in the UI while model loads

### Services
- [x] Create job polling service
- [x] Update model service to handle job-based workflow

## Testing
- [x] Test job creation flow
- [x] Test job status polling
- [ ] Test model generation and preview creation
- [ ] Test S3 uploads
- [x] Test error handling and recovery
- [ ] End-to-end testing of complete workflow

## Deployment
- [x] Update environment variables for production
- [x] Configure database access for Python API
- [x] Set up S3 permissions
- [x] Create deployment documentation
