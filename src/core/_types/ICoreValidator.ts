export interface ICoreValidator {
    validateEnvironmentVariables(): void;
    validateConfiguration(): void;
    checkDependencies(): void;
    checkApplicationVersion(): void;
}
