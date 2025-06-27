import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { PromptService } from '../../../src/services/prompt/service';
import { ModelManager } from '../../../src/services/model/manager';
import { TemplateManager } from '../../../src/services/template/manager';
import { HistoryManager } from '../../../src/services/history/manager';
import { LocalStorageProvider } from '../../../src/services/storage/localStorageProvider';
import { createLLMService } from '../../../src/services/llm/service';
import { Template, MessageTemplate } from '../../../src/services/template/types';

/**
 * PromptService集成测试 - 使用真实的Gemini API
 */
describe('PromptService Integration Tests', () => {
  const hasGeminiKey = !!process.env.VITE_GEMINI_API_KEY;
  
  let promptService: PromptService;
  let modelManager: ModelManager;
  let llmService: any;
  let templateManager: TemplateManager;
  let historyManager: HistoryManager;
  let storage: LocalStorageProvider;

  beforeAll(() => {
    console.log('Gemini API Key available:', hasGeminiKey);
    if (!hasGeminiKey) {
      console.log('Skipping PromptService integration tests: GEMINI_API_KEY environment variable not set');
    }
  });

  beforeEach(async () => {
    // 初始化存储和管理器
    storage = new LocalStorageProvider();
    modelManager = new ModelManager(storage);
    llmService = createLLMService(modelManager);
    templateManager = new TemplateManager(storage);
    historyManager = new HistoryManager(storage);

    // 初始化服务
    promptService = new PromptService(modelManager, llmService, templateManager, historyManager);

    // 清理存储
    await storage.clearAll();

    // 只有在有API密钥时才添加模型
    if (hasGeminiKey) {
      await modelManager.addModel('test-gemini', {
        name: 'Test Gemini Model',
        provider: 'gemini',
        apiKey: process.env.VITE_GEMINI_API_KEY!,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        defaultModel: 'gemini-2.0-flash-exp',
        models: ['gemini-2.0-flash-exp'],
        enabled: true,
        llmParams: {
          temperature: 0.7,
          max_output_tokens: 1000
        }
      });
    }
  });

  describe('optimizePrompt with different template formats', () => {
    it.runIf(hasGeminiKey)('should work with string-based templates', async () => {
      const request = {
        optimizationMode: 'system' as const,
        targetPrompt: 'Write a simple greeting',
        modelKey: 'test-gemini'
      };
      const result = await promptService.optimizePrompt(request);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // 验证历史记录
      const records = await historyManager.getRecords();
      expect(records.length).toBe(1);
      expect(records[0].type).toBe('optimize');
    }, 30000);

    it.runIf(hasGeminiKey)('should work with message-based templates', async () => {
      // 添加一个消息模板
      const messageTemplate: Template = {
        id: 'test-message-template',
        name: 'Test Message Template',
        content: [
          {
            role: 'system',
            content: 'You are a helpful assistant specializing in {{domain}}.'
          },
          {
            role: 'user',
            content: 'Please optimize this prompt: {{originalPrompt}}'
          }
        ] as MessageTemplate[],
        metadata: {
          version: '1.0',
          lastModified: Date.now(),
          templateType: 'optimize',
          language: 'zh' as const
        }
      };

      await templateManager.saveTemplate(messageTemplate);

      // 使用spy来模拟getTemplate返回我们的模板
      const getTemplateSpy = vi.spyOn(templateManager, 'getTemplate').mockReturnValue(messageTemplate);

      const request = {
        optimizationMode: 'system' as const,
        targetPrompt: 'Write a simple greeting',
        modelKey: 'test-gemini'
      };
      const result = await promptService.optimizePrompt(request);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // 验证模板被调用
      expect(getTemplateSpy).toHaveBeenCalled();

      // 恢复spy
      getTemplateSpy.mockRestore();
    }, 30000);

    it.skipIf(!hasGeminiKey)('skip string-based templates test - no Gemini API key', () => {
      expect(true).toBe(true);
    });
  });

  describe('iteratePrompt with different template formats', () => {
    it.runIf(hasGeminiKey)('should work with string-based iterate templates', async () => {
      const result = await promptService.iteratePrompt(
        'Write a simple greeting',
        'Hello world',
        'Make it more formal',
        'test-gemini'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // 验证历史记录
      const records = await historyManager.getRecords();
      expect(records.length).toBe(1);
      expect(records[0].type).toBe('iterate');
    }, 30000);

    it.runIf(hasGeminiKey)('should work with message-based iterate templates', async () => {
      // 添加迭代模板
      const iterateTemplate: Template = {
        id: 'test-iterate-template',
        name: 'Test Iterate Template',
        content: [
          {
            role: 'system',
            content: 'You are an expert prompt optimizer.'
          },
          {
            role: 'user',
            content: 'Original: {{originalPrompt}}'
          },
          {
            role: 'user',
            content: 'Improvement request: {{iterateInput}}'
          }
        ] as MessageTemplate[],
        metadata: {
          version: '1.0',
          lastModified: Date.now(),
          templateType: 'iterate',
          language: 'zh' as const
        }
      };

      await templateManager.saveTemplate(iterateTemplate);

      // 模拟getTemplate返回迭代模板
      const getTemplateSpy = vi.spyOn(templateManager, 'getTemplate').mockReturnValue(iterateTemplate);

      const result = await promptService.iteratePrompt(
        'Write a simple greeting',
        'Hello world',
        'Make it more creative',  
        'test-gemini'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      // 验证模板被调用
      expect(getTemplateSpy).toHaveBeenCalled();

      // 恢复spy
      getTemplateSpy.mockRestore();
    }, 30000);

    it.skipIf(!hasGeminiKey)('skip iterate templates test - no Gemini API key', () => {
      expect(true).toBe(true);
    });
  });

  describe('streaming methods', () => {
    it.runIf(hasGeminiKey)('should handle optimizePromptStream', async () => {
      const tokens: string[] = [];
      let completed = false;

      const request = {
        optimizationMode: 'system' as const,
        targetPrompt: 'Write a simple greeting',
        modelKey: 'test-gemini',
        templateId: 'general-optimize'
      };

      // 使用Promise来确保onComplete被正确等待
      await new Promise<void>((resolve, reject) => {
        promptService.optimizePromptStream(
          request,
          {
            onToken: (token) => tokens.push(token),
            onComplete: () => {
              completed = true;
              resolve();
            },
            onError: (error) => {
              reject(error);
            }
          }
        ).catch(reject);
      });

      expect(tokens.length).toBeGreaterThan(0);
      expect(completed).toBe(true);

      // 验证接收到的内容
      const fullContent = tokens.join('');
      expect(fullContent.length).toBeGreaterThan(0);
    }, 30000);

    it.runIf(hasGeminiKey)('should handle iteratePromptStream with template objects', async () => {
      const tokens: string[] = [];
      let completed = false;

      // 使用Promise来确保onComplete被正确等待
      await new Promise<void>((resolve, reject) => {
        promptService.iteratePromptStream(
          'Write a simple greeting',
          'Hello world',
          'Make it better',
          'test-gemini',
          {
            onToken: (token) => tokens.push(token),
            onComplete: () => {
              completed = true;
              resolve();
            },
            onError: (error) => {
              reject(error);
            }
          },
          'iterate'
        ).catch(reject);
      });

      expect(tokens.length).toBeGreaterThan(0);
      expect(completed).toBe(true);

      // 验证接收到的内容
      const fullContent = tokens.join('');
      expect(fullContent.length).toBeGreaterThan(0);
    }, 30000);

    it.skipIf(!hasGeminiKey)('skip streaming tests - no Gemini API key', () => {
      expect(true).toBe(true);
    });
  });

  describe('error handling', () => {
    it.runIf(hasGeminiKey)('should handle template not found errors', async () => {
      // 模拟模板未找到
      const getTemplateSpy = vi.spyOn(templateManager, 'getTemplate').mockImplementation(() => {
        throw new Error('Template not found');
      });

      const request = {
        optimizationMode: 'system' as const,
        targetPrompt: 'Test prompt',
        modelKey: 'test-gemini'
      };
      await expect(
        promptService.optimizePrompt(request)
      ).rejects.toThrow(/Template not found/);

      // 恢复spy
      getTemplateSpy.mockRestore();
    });

    it.runIf(hasGeminiKey)('should handle invalid template content', async () => {
      const invalidTemplate: Template = {
        id: 'invalid',
        name: 'Invalid Template',
        content: null as any,
        metadata: {
          version: '1.0',
          lastModified: Date.now(),
          templateType: 'optimize',
          language: 'zh' as const
        }
      };

      const getTemplateSpy = vi.spyOn(templateManager, 'getTemplate').mockReturnValue(invalidTemplate);

      const request = {
        optimizationMode: 'system' as const,
        targetPrompt: 'Test prompt',
        modelKey: 'test-gemini'
      };
      await expect(
        promptService.optimizePrompt(request)
      ).rejects.toThrow(/Template not found or invalid/);

      // 恢复spy
      getTemplateSpy.mockRestore();
    });

    it.skipIf(!hasGeminiKey)('skip error handling tests - no Gemini API key', () => {
      expect(true).toBe(true);
    });
  });
});
