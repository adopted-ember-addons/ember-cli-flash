import FlashMessagesService from '#src/services/flash-messages.ts';

import type { FlashObjectOptions } from '#src/flash/object.ts';

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

/** Options type combining flash options with custom fields */
type Options = FlashObjectOptions<CustomFlashFields> & CustomFlashFields;

/**
 * Extended FlashMessages service demonstrating:
 * - TypeScript generics for custom fields
 * - Custom default configuration
 * - Custom convenience methods
 * - Dynamically registered custom types
 */
export default class MyFlashMessagesService extends FlashMessagesService<CustomFlashFields> {
  /**
   * Declare custom types not in the base class.
   * Base class already declares: success, info, warning, danger, alert, secondary
   */
  declare error: (message: string, options?: Options) => this;
  declare notice: (message: string, options?: Options) => this;

  /**
   * Override defaults to customize behavior
   */
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 4000,
      showProgress: false,
      // Add custom types (base types are included automatically)
      types: [
        'success',
        'info',
        'warning',
        'danger',
        'alert',
        'secondary',
        'error',
        'notice',
      ],
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
