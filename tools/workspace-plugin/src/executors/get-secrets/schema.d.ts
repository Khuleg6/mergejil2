export interface GetSecretsExecutorSchema {
  /** Secret group name, or list of groups merged left-to-right. */
  secrets: string | string[];
  /** Directory the env file is written to. Defaults to the project root. */
  path?: string;
  /** Output filename. `.env` for Next.js apps, `.dev.vars` for Workers. */
  filename?: string;
  /** Override the configured service URL. */
  serviceUrl?: string;
}
