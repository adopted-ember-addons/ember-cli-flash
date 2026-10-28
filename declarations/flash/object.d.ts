import { type Timer } from '@ember/runloop';
import type { SafeString } from '@ember/template';
export type Message = string | SafeString;
interface FlashService<T extends Record<string, unknown>> {
    queue?: FlashObject<T>[];
    removeFromGuidSet?(guid: string): void;
}
export type FlashObjectOptions<T extends Record<string, unknown> = Record<string, unknown>> = {
    message?: Message;
    type?: string;
    priority?: number;
    timeout?: number;
    extendedTimeout?: number;
    sticky?: boolean;
    showProgress?: boolean;
    destroyOnClick?: boolean;
    preventDuplicates?: boolean;
    testHelperDisableTimeout?: boolean;
    flashService?: FlashService<T>;
    onDestroy?: () => void;
    onDidDestroyMessage?: () => void;
    onDidExitMessage?: () => void;
} & T;
export default class FlashObject<T extends Record<string, unknown> = Record<string, unknown>> {
    #private;
    static isTimeoutDisabled: boolean;
    exiting: boolean;
    message: Message;
    type: string;
    priority: number;
    timeout: number;
    extendedTimeout: number;
    sticky: boolean;
    showProgress: boolean;
    destroyOnClick: boolean;
    preventDuplicates: boolean;
    onDestroy?: () => void;
    onDidDestroyMessage?: () => void;
    onDidExitMessage?: () => void;
    get _guid(): string;
    constructor(options: FlashObjectOptions<T>);
    /** Destroy this flash message immediately, triggering exit animation. */
    destroyMessage(): void;
    /** Trigger the exit flow (respects isExitable). */
    exitMessage(): void;
    /** Prevent the message from exiting (e.g., on mouse enter). */
    preventExit(): void;
    /** Allow the message to exit again (e.g., on mouse leave). */
    allowExit(): void;
    /** Pause the auto-dismiss timer. */
    pauseTimer(): void;
    /** Resume the auto-dismiss timer with remaining time. */
    resumeTimer(): void;
    get isExitable(): boolean;
    get timerTaskInstance(): Timer | undefined;
}
export {};
//# sourceMappingURL=object.d.ts.map