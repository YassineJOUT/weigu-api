export declare const sendSuccessEmail: (email: string) => Promise<void>;
export declare const sendSuccessRegisterEmail: (email: string) => Promise<void>;
export declare const sendConfirmationCodeByMail: (email: string, confirmationCode: number) => Promise<void>;
export declare const sendRegistarationEmail: (email: string, confirmationCode: number) => Promise<void>;
export declare const magicLinkEmail: (email: string, link: string) => Promise<void>;
