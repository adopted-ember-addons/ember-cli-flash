import FlashMessagesService from '#src/services/flash-messages.ts';

/**
 * Custom fields interface for our flash messages.
 * This demonstrates TypeScript generics support.
 */
export interface CustomFlashFields {
  /** Index signature required for Record<string, unknown> constraint */
  [key: string]: unknown;
  /** Unique identifier for finding/removing specific messages */
  id?: string;
  /** Category for filtering messages */
  category?: 'system' | 'user' | 'background';
  /** Optional callback when message is clicked */
  onAction?: () => void;
}

/**
 * Extended FlashMessages service demonstrating:
 * - TypeScript generics for custom fields
 * - Custom default configuration
 * - Custom convenience methods
 */
export default class MyFlashMessagesService extends FlashMessagesService<CustomFlashFields> {
  /**
   * Override defaults to customize behavior
   */
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 4000,
      showProgress: false,
    };
  }

  /**
   * Custom convenience method for system notifications
   */
  systemNotification(message: string) {
    return this.add({
      message,
      type: 'info',
      category: 'system',
      id: `system-${Date.now()}`,
      sticky: true,
    });
  }

  /**
   * Custom convenience method for background task notifications
   */
  backgroundTask(message: string, id: string) {
    return this.add({
      message,
      type: 'secondary',
      category: 'background',
      id,
      showProgress: true,
      timeout: 10000,
    });
  }
}
