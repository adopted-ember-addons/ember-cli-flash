import Service from '@ember/service';
import FlashMessage from '../flash/object.ts';
import type { Message } from '../flash/object.ts';
import type Owner from '@ember/owner';
type FlashMessageDefaults = {
    timeout: number;
    extendedTimeout: number;
    priority: number;
    sticky: boolean;
    showProgress: boolean;
    type: string;
    types: string[];
    preventDuplicates: boolean;
    destroyOnClick: boolean;
};
type FlashMessageOptions<T extends Record<string, unknown> = Record<string, unknown>> = Partial<FlashMessageDefaults> & {
    message?: Message;
    onDestroy?: () => void;
    onDidDestroyMessage?: () => void;
    onDidExitMessage?: () => void;
    testHelperDisableTimeout?: boolean;
} & T;
type FlashMessageInstance<T extends Record<string, unknown> = Record<string, unknown>> = FlashMessage<T> & T & {
    _guid: string;
    priority: number;
    message: Message;
    type: string;
    preventDuplicates: boolean;
};
type FlashTypeFunction<T extends Record<string, unknown> = Record<string, unknown>> = (message: Message, options?: FlashMessageOptions<T>) => FlashMessagesService<T>;
export default class FlashMessagesService<T extends Record<string, unknown> = Record<string, unknown>> extends Service {
    #private;
    queue: FlashMessageInstance<T>[];
    success: FlashTypeFunction<T>;
    info: FlashTypeFunction<T>;
    warning: FlashTypeFunction<T>;
    danger: FlashTypeFunction<T>;
    alert: FlashTypeFunction<T>;
    secondary: FlashTypeFunction<T>;
    [key: string]: unknown;
    get arrangedQueue(): FlashMessageInstance<T>[];
    get isEmpty(): boolean;
    get defaultTimeout(): number;
    get defaultExtendedTimeout(): number;
    get defaultPriority(): number;
    get defaultSticky(): boolean;
    get defaultShowProgress(): boolean;
    get defaultType(): string;
    get defaultTypes(): string[];
    get defaultPreventDuplicates(): boolean;
    set defaultPreventDuplicates(value: boolean);
    /**
     * For backward compatibility - returns array of message guids
     */
    get _guids(): string[];
    constructor(owner: Owner);
    /** Add a flash message to the queue. Returns the service for chaining. */
    add(options?: FlashMessageOptions<T>): this;
    /** Clear all flash messages from the queue. */
    clearMessages(): this | void;
    /** Register custom flash message types (e.g., 'custom' creates service.custom()). */
    registerTypes(types?: string[]): this;
    /** Get the first flash message in the queue. */
    peekFirst(): FlashMessageInstance<T> | undefined;
    /** Get the last flash message in the queue. */
    peekLast(): FlashMessageInstance<T> | undefined;
    /** Get the last flash message (throws if queue is empty). */
    getFlashObject(): FlashMessageInstance<T>;
    /**
     * Find a flash message by a custom field (e.g., 'id').
     */
    findBy<K extends keyof FlashMessageInstance<T>>(key: K, value: FlashMessageInstance<T>[K]): FlashMessageInstance<T> | undefined;
    /**
     * Remove a flash message by a custom field (e.g., 'id').
     */
    removeBy<K extends keyof FlashMessageInstance<T>>(key: K, value: FlashMessageInstance<T>[K]): boolean;
    /**
     * Override this getter to customize defaults:
     *
     * ```typescript
     * export default class MyFlashMessages extends FlashMessagesService {
     *   get flashMessageDefaults() {
     *     return { ...super.flashMessageDefaults, timeout: 5000 };
     *   }
     * }
     * ```
     */
    get flashMessageDefaults(): FlashMessageDefaults;
    /**
     * Called by FlashObject when it's destroyed to remove from guid set
     */
    removeFromGuidSet(guid: string): void;
}
export {};
//# sourceMappingURL=flash-messages.d.ts.map