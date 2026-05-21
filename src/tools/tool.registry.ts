/**
 * ============================================================
 *  TOOL REGISTRY
 *
 *  This is the heart of the agent. Every tool Gemini can call
 *  is defined here in two parts:
 *
 *  1. DECLARATION  — what Gemini sees (name, description, params)
 *  2. HANDLER      — what actually runs when Gemini calls it
 *
 *  HOW TO ADD A NEW TOOL:
 *  1. Add a flag in src/config/features.ts → tools: { myTool: true }
 *  2. Write the handler function below
 *  3. Add the FunctionDeclaration to TOOL_DECLARATIONS
 *  4. Add the handler to TOOL_HANDLERS
 *  5. That's it — Gemini will discover and call it automatically
 *
 *  FOR FUTURE AGENTS:
 *  Each tool handler receives params from Gemini and must return
 *  a plain string (the result Gemini reads to form its response).
 *  Keep handlers focused — one job per tool.
 * ============================================================
 */

import { SchemaType } from '@google/generative-ai';
import { isToolEnabled } from '../config/features';
import { ENV } from '../config/env';

// ── Types ──────────────────────────────────────────────────────

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export type ToolHandler = (params: Record<string, unknown>) => Promise<string>;

export interface RegisteredTool {
  declaration: {
    name: string;
    description: string;
    parameters: object;
  };
  handler: ToolHandler;
}

// ── Tool Handlers ──────────────────────────────────────────────

/**
 * TOOL: search_youtube
 * Searches YouTube Data API v3 and returns top video results.
 * Gemini calls this when user asks to find videos about a topic.
 */
async function handleYoutubeSearch(params: Record<string, unknown>): Promise<string> {
  const query = params.query as string;
  const maxResults = (params.maxResults as number) ?? ENV.youtube.maxResults;
  const order = (params.order as string) ?? 'relevance'; // relevance | viewCount | rating | date

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('order', order);
    url.searchParams.set('type', 'video');
    url.searchParams.set('key', ENV.youtube.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

    const data = await res.json();
    const videos = data.items?.map((item: any) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      description: item.snippet?.description?.slice(0, 120),
      thumbnail: item.snippet?.thumbnails?.medium?.url,
      publishedAt: item.snippet?.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    })) ?? [];

    return JSON.stringify({ videos, query, total: videos.length });
  } catch (err) {
    return JSON.stringify({ error: String(err), videos: [] });
  }
}

/**
 * TOOL: web_search
 * Google Custom Search API. Returns top web results.
 */
async function handleWebSearch(params: Record<string, unknown>): Promise<string> {
  const query = params.query as string;
  const num = (params.num as number) ?? 5;

  try {
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('q', query);
    url.searchParams.set('num', String(num));
    url.searchParams.set('key', ENV.search.apiKey);
    url.searchParams.set('cx', ENV.search.engineId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Search API error: ${res.status}`);

    const data = await res.json();
    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    })) ?? [];

    return JSON.stringify({ results, query });
  } catch (err) {
    return JSON.stringify({ error: String(err), results: [] });
  }
}

/**
 * TOOL: save_to_library
 * Saves an item (video, analysis, note) to local SQLite DB.
 * The actual DB write is handled by the db service layer.
 * Gemini calls this when the user says "save this" or "add to my list".
 */
async function handleSaveToLibrary(params: Record<string, unknown>): Promise<string> {
  // Lazy import to avoid circular deps
  const { dbService } = await import('../db/db.service');
  try {
    const item = {
      type: (params.type as 'video' | 'analysis' | 'note' | 'link') ?? 'note',
      title: params.title as string,
      content: JSON.stringify(params.content ?? params.data ?? params),
      tags: (params.tags as string[])?.join(',') ?? '',
      createdAt: Date.now(),
    };
    const id = await dbService.saveItem(item);
    return JSON.stringify({ success: true, id, message: `Saved "${item.title}" to your library.` });
  } catch (err) {
    return JSON.stringify({ success: false, error: String(err) });
  }
}

/**
 * TOOL: get_from_library
 * Retrieves saved items from local SQLite DB by type or search query.
 */
async function handleGetFromLibrary(params: Record<string, unknown>): Promise<string> {
  const { dbService } = await import('../db/db.service');
  try {
    const items = await dbService.getItems({
      type: params.type as string | undefined,
      search: params.search as string | undefined,
      limit: (params.limit as number) ?? 20,
    });
    return JSON.stringify({ items, count: items.length });
  } catch (err) {
    return JSON.stringify({ error: String(err), items: [] });
  }
}

/**
 * TOOL: get_current_time
 * Returns current date/time. Useful for scheduling and context.
 */
async function handleGetCurrentTime(_params: Record<string, unknown>): Promise<string> {
  const now = new Date();
  return JSON.stringify({
    iso: now.toISOString(),
    readable: now.toLocaleString(),
    timestamp: now.getTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

/**
 * TOOL: log_swing_analysis
 * Persist a completed swing analysis to the biomechanics database.
 * Gemini calls this after presenting a full camera analysis so the
 * record is stored long-term without any user action required.
 */
async function handleLogSwingAnalysis(params: Record<string, unknown>): Promise<string> {
  const { biomechanicsDbService } = await import('../db/biomechanics.db.service');
  try {
    const rawText = params.rawText as string;
    if (!rawText) return JSON.stringify({ success: false, error: 'rawText is required.' });

    await biomechanicsDbService.persistAnalysis({
      rawText,
      videoUri: (params.videoUri as string) ?? undefined,
      durationSeconds: (params.durationSeconds as number) ?? undefined,
    });

    return JSON.stringify({
      success: true,
      message: 'Swing analysis saved to the biomechanics database.',
      parsed: biomechanicsDbService.parseAnalysisText(rawText),
    });
  } catch (err) {
    return JSON.stringify({ success: false, error: String(err) });
  }
}

/**
 * TOOL: get_player_analytics
 * Return aggregated player analytics from the biomechanics database.
 * Use this when the user asks "how am I doing?", "show my progress",
 * "what's my best shot?", or "what fault do I repeat most?".
 */
async function handleGetPlayerAnalytics(params: Record<string, unknown>): Promise<string> {
  const { biomechanicsDbService } = await import('../db/biomechanics.db.service');
  try {
    const limit = (params.limit as number) ?? 10;
    const shotType = (params.shotType as string) ?? undefined;

    const [summary, stats, byShot, byCategory] = await Promise.all([
      biomechanicsDbService.getProgressSummary(),
      biomechanicsDbService.getPlayerStats(),
      biomechanicsDbService.getSessionsByShotType(),
      biomechanicsDbService.getCorrectionsByCategory(),
    ]);

    let sessions = summary.sessions;
    if (shotType) {
      sessions = sessions.filter((s) => s.shotType.toLowerCase() === shotType.toLowerCase());
    }

    return JSON.stringify({
      success: true,
      totalSessions: summary.totalSessions,
      avgScore: summary.avgScore,
      bestScore: summary.bestScore,
      recentSessions: sessions.slice(0, limit).map((s) => ({
        id: s.id,
        shotType: s.shotType,
        overallScore: s.overallScore,
        createdAt: s.createdAt,
        emotion: s.emotion,
      })),
      shotTypeBreakdown: byShot,
      commonCorrections: byCategory.slice(0, 8),
    });
  } catch (err) {
    return JSON.stringify({ success: false, error: String(err) });
  }
}

// ── Tool Declarations (what Gemini sees) ───────────────────────

const YOUTUBE_SEARCH_DECLARATION = {
  name: 'search_youtube',
  description:
    'Search YouTube for videos on any topic. Returns a list of videos with titles, channels, thumbnails, and URLs. Use this when the user asks to find, show, or list YouTube videos about something.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: 'The search query, e.g. "tennis serve technique for beginners"',
      },
      maxResults: {
        type: SchemaType.NUMBER,
        description: 'Number of results to return (default 8, max 20)',
      },
      order: {
        type: SchemaType.STRING,
        description: 'Sort order: relevance (default), viewCount, rating, or date',
        enum: ['relevance', 'viewCount', 'rating', 'date'],
      },
    },
    required: ['query'],
  },
};

const WEB_SEARCH_DECLARATION = {
  name: 'web_search',
  description:
    'Search the web for current information on any topic. Returns links and snippets. Use when YouTube is not enough or the user needs general information.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description: 'The web search query',
      },
      num: {
        type: SchemaType.NUMBER,
        description: 'Number of results (default 5, max 10)',
      },
    },
    required: ['query'],
  },
};

const SAVE_TO_LIBRARY_DECLARATION = {
  name: 'save_to_library',
  description:
    'Save something to the user\'s personal library — a video, analysis result, note, or any item. Use when the user says "save this", "add to my list", "remember this", or similar.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      type: {
        type: SchemaType.STRING,
        description: 'Item type: video | analysis | note | link',
        enum: ['video', 'analysis', 'note', 'link'],
      },
      title: {
        type: SchemaType.STRING,
        description: 'A short descriptive title for the item',
      },
      content: {
        type: SchemaType.OBJECT,
        description: 'The item data to save (video URL, analysis text, etc.)',
      },
      tags: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: 'Optional tags for filtering later',
      },
    },
    required: ['type', 'title', 'content'],
  },
};

const GET_FROM_LIBRARY_DECLARATION = {
  name: 'get_from_library',
  description:
    'Retrieve saved items from the user\'s library. Use when the user asks to see their saved videos, past analyses, or notes.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      type: {
        type: SchemaType.STRING,
        description: 'Filter by type: video | analysis | note | link',
        enum: ['video', 'analysis', 'note', 'link'],
      },
      search: {
        type: SchemaType.STRING,
        description: 'Optional text to search within saved items',
      },
      limit: {
        type: SchemaType.NUMBER,
        description: 'Max items to return (default 20)',
      },
    },
    required: [],
  },
};

const GET_CURRENT_TIME_DECLARATION = {
  name: 'get_current_time',
  description: 'Get the current date and time. Use for scheduling context or time-based responses.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {},
    required: [],
  },
};

const LOG_SWING_ANALYSIS_DECLARATION = {
  name: 'log_swing_analysis',
  description:
    'Persist the current swing analysis to the biomechanics database so the player coaching history is tracked over time. Call this after delivering a full camera analysis to the user.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      rawText: {
        type: SchemaType.STRING,
        description: 'The full raw text of the Gemini swing analysis (everything that was shown to the user).',
      },
      videoUri: {
        type: SchemaType.STRING,
        description: 'Optional local file URI of the recorded video that was analysed.',
      },
      durationSeconds: {
        type: SchemaType.NUMBER,
        description: 'Duration of the swing video clip in seconds.',
      },
    },
    required: ['rawText'],
  },
};

const GET_PLAYER_ANALYTICS_DECLARATION = {
  name: 'get_player_analytics',
  description:
    'Return aggregated player swing analytics from the biomechanics database — total sessions, average score, best score, common faults, and recent session history. Use this when the user asks about progress, improvements, or repeated technique faults.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      limit: {
        type: SchemaType.NUMBER,
        description: 'Max number of recent sessions to include (default 10).',
      },
      shotType: {
        type: SchemaType.STRING,
        description: 'Optional filter: only return sessions for this shot type (e.g. "Serve", "Forehand").',
      },
    },
    required: [],
  },
};

// ── Registry Builder ───────────────────────────────────────────

/**
 * Returns only the tools that are currently enabled in features.ts.
 * Gemini only sees and can call enabled tools.
 */
export function buildToolRegistry(): RegisteredTool[] {
  const tools: RegisteredTool[] = [];

  if (isToolEnabled('youtubeSearch')) {
    tools.push({ declaration: YOUTUBE_SEARCH_DECLARATION, handler: handleYoutubeSearch });
  }
  if (isToolEnabled('webSearch')) {
    tools.push({ declaration: WEB_SEARCH_DECLARATION, handler: handleWebSearch });
  }
  if (isToolEnabled('saveToLibrary')) {
    tools.push({ declaration: SAVE_TO_LIBRARY_DECLARATION, handler: handleSaveToLibrary });
  }
  if (isToolEnabled('getFromLibrary')) {
    tools.push({ declaration: GET_FROM_LIBRARY_DECLARATION, handler: handleGetFromLibrary });
  }
  if (isToolEnabled('getCurrentTime')) {
    tools.push({ declaration: GET_CURRENT_TIME_DECLARATION, handler: handleGetCurrentTime });
  }
  if (isToolEnabled('logSwingAnalysis')) {
    tools.push({ declaration: LOG_SWING_ANALYSIS_DECLARATION, handler: handleLogSwingAnalysis });
  }
  if (isToolEnabled('getPlayerAnalytics')) {
    tools.push({ declaration: GET_PLAYER_ANALYTICS_DECLARATION, handler: handleGetPlayerAnalytics });
  }

  return tools;
}

