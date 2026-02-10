import Component from '@glimmer/component';
import type { Timer } from '@ember/runloop';
import type FlashObject from '../flash/object.ts';
type FlashWithCustomProps<T extends Record<string, unknown>> = FlashObject<T> & T;
export interface FlashMessageSignature<T extends Record<string, unknown> = Record<string, unknown>> {
    Args: {
        flash: FlashObject<T>;
        messageStyle?: 'bootstrap' | 'foundation';
        messageStylePrefix?: string;
        exitingClass?: string;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [FlashMessage<T>, FlashWithCustomProps<T>, onClose: () => void];
    };
}
export default class FlashMessage<T extends Record<string, unknown> = Record<string, unknown>> extends Component<FlashMessageSignature<T>> {
    #private;
    active: boolean;
    pendingSet: Timer | undefined;
    _mouseEnterHandler: ((event?: Event) => void) | undefined;
    _mouseLeaveHandler: ((event?: Event) => void) | undefined;
    get messageStyle(): "bootstrap" | "foundation";
    get flash(): FlashWithCustomProps<T>;
    get showProgress(): boolean;
    get notExiting(): boolean;
    get showProgressBar(): boolean;
    get exiting(): boolean;
    get exitingClass(): string;
    get messageStylePrefix(): string;
    get _defaultMessageStylePrefix(): "alert-box " | "alert alert-";
    get alertType(): string;
    get flashType(): string;
    get classNames(): string;
    get progressDuration(): import("@ember/template").TrustedHTML | undefined;
    onClick: () => void;
    onClose: () => void;
    bindEvents: import("ember-modifier").FunctionBasedModifier<{
        Args: {
            Positional: unknown[];
            Named: import("ember-modifier/-private/signature").EmptyObject;
        };
        Element: Element;
    }>;
}
export {};
//# sourceMappingURL=flash-message.d.ts.map