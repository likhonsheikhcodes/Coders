import express from 'express';
import { createMemoryServer } from '@modelcontextprotocol/server-memory';
import { createFilesystemServer } from '@modelcontextprotocol/server-filesystem';
import { createGithubServer } from '@modelcontextprotocol/server-github';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.MCP_PORT || 3001;

// Initialize MCP servers
const memoryServer = createMemoryServer();
const filesystemServer = createFilesystemServer({
  allowedPaths: ['/workspaces/Coders']
});
const githubServer = createGithubServer({
  personalAccessToken: process.env.GITHUB_TOKEN
});

// Middleware
app.use(express.json());

// Routes for different MCP servers
app.use('/mcp/memory', memoryServer);
app.use('/mcp/filesystem', filesystemServer);
app.use('/mcp/github', githubServer);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});