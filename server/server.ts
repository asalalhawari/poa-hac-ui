import { app } from './app.js';

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('=======================================================');
  console.log(`🚀 HAC Signal Investigation Service Running on Port ${PORT}`);
  console.log(`🏥 Health Check:      http://localhost:${PORT}/api/health`);
  console.log(`📑 Review Queue API:  http://localhost:${PORT}/api/hac/review-queue`);
  console.log(`📊 Analytics API:     http://localhost:${PORT}/api/hac/analytics`);
  console.log(`📚 Reference API:     http://localhost:${PORT}/api/hac/reference/codes`);
  console.log(`⚙️  Config Service:    http://localhost:${PORT}/api/hac/config`);
  console.log('=======================================================');
});
