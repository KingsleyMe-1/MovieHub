import { useState, useEffect, useRef, useCallback } from 'react';
import puter from '@heyputer/puter.js';

export const useAiChat = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const aiInputRef = useRef(null);

  const toggleAi = useCallback(() => {
    setIsAiOpen((s) => !s);
  }, []);

  const closeAi = useCallback(() => {
    setIsAiOpen(false);
  }, []);

  useEffect(() => {
    if (!isAiOpen) return;
    setAiError('');
  }, [isAiOpen]);

  useEffect(() => {
    if (isAiOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    document.body.style.overflow = document.body.style.overflow || '';
    return undefined;
  }, [isAiOpen]);

  const sendMessage = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiMessages((m) => [...m, { from: 'user', text: prompt }]);
    try {
      if (!puter?.auth?.isSignedIn || !puter.auth.isSignedIn()) {
        setAiError('Please sign in to Puter to use the AI assistant.');
        setAiLoading(false);
        return;
      }

      let result;
      if (puter?.ai && typeof puter.ai.chat === 'function') {
        result = await puter.ai.chat(prompt, {
          model: 'openai/gpt-5.2-chat',
          tools: [{ type: 'web_search' }],
        });
      } else {
        throw new Error('Puter.ai.chat not available — check library import');
      }

      let text = null;
      if (result?.message?.content && typeof result.message.content === 'string') {
        text = result.message.content;
      }

      if (!text) text = 'No content returned from AI.';
      text = String(text).trim();

      setAiMessages((m) => [...m, { from: 'ai', text }]);
    } catch (err) {
      setAiError(String(err.message || err));
      setAiMessages((m) => [
        ...m,
        { from: 'ai', text: 'Puter.js unavailable or returned an error.' },
      ]);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((value) => {
    setAiInput(value);
    try {
      if (aiInputRef?.current) {
        const el = aiInputRef.current;
        el.style.height = 'auto';
        const newHeight = Math.min(el.scrollHeight, 240);
        el.style.height = newHeight + 'px';
        el.style.overflowY = el.scrollHeight > 240 ? 'auto' : 'hidden';
      }
    } catch {
    
    }
  }, []);

  const resetInputHeight = useCallback(() => {
    setTimeout(() => {
      try {
        if (aiInputRef?.current) {
          aiInputRef.current.style.height = 'auto';
          aiInputRef.current.style.overflowY = 'hidden';
        }
      } catch {
        // ignore
      }
    }, 0);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const prompt = aiInput?.trim();
        if (prompt) {
          sendMessage(prompt);
          setAiInput('');
          resetInputHeight();
        }
      }
    },
    [aiInput, sendMessage, resetInputHeight]
  );

  return {
    isAiOpen,
    aiInput,
    aiMessages,
    aiLoading,
    aiError,
    aiInputRef,
    toggleAi,
    closeAi,
    handleInputChange,
    handleKeyDown,
  };
};
