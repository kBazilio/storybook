import dedent from 'ts-dedent';
import { StorybookError } from './storybook-error';

/**
 * If you can't find a suitable category for your error, create one
 * based on the package name/file path of which the error is thrown.
 * For instance:
 * If it's from @storybook/node-logger, then NODE-LOGGER
 * If it's from a package that is too broad, e.g. @storybook/cli in the init command, then use a combination like CLI_INIT
 */
export enum Category {
  CLI = 'CLI',
  CLI_INIT = 'CLI_INIT',
  CLI_AUTOMIGRATE = 'CLI_AUTOMIGRATE',
  CLI_UPGRADE = 'CLI_UPGRADE',
  CLI_ADD = 'CLI_ADD',
  CODEMOD = 'CODEMOD',
  CORE_SERVER = 'CORE-SERVER',
  CSF_PLUGIN = 'CSF-PLUGIN',
  CSF_TOOLS = 'CSF-TOOLS',
  CORE_COMMON = 'CORE-COMMON',
  NODE_LOGGER = 'NODE-LOGGER',
  TELEMETRY = 'TELEMETRY',
  BUILDER_MANAGER = 'BUILDER-MANAGER',
  BUILDER_VITE = 'BUILDER-VITE',
  BUILDER_WEBPACK5 = 'BUILDER-WEBPACK5',
  SOURCE_LOADER = 'SOURCE-LOADER',
  POSTINSTALL = 'POSTINSTALL',
  DOCS_TOOLS = 'DOCS-TOOLS',
  CORE_WEBPACK = 'CORE-WEBPACK',
  FRAMEWORK_ANGULAR = 'FRAMEWORK_ANGULAR',
  FRAMEWORK_EMBER = 'FRAMEWORK_EMBER',
  FRAMEWORK_HTML_VITE = 'FRAMEWORK_HTML-VITE',
  FRAMEWORK_HTML_WEBPACK5 = 'FRAMEWORK_HTML-WEBPACK5',
  FRAMEWORK_NEXTJS = 'FRAMEWORK_NEXTJS',
  FRAMEWORK_PREACT_VITE = 'FRAMEWORK_PREACT-VITE',
  FRAMEWORK_PREACT_WEBPACK5 = 'FRAMEWORK_PREACT-WEBPACK5',
  FRAMEWORK_REACT_VITE = 'FRAMEWORK_REACT-VITE',
  FRAMEWORK_REACT_WEBPACK5 = 'FRAMEWORK_REACT-WEBPACK5',
  FRAMEWORK_SERVER_WEBPACK5 = 'FRAMEWORK_SERVER-WEBPACK5',
  FRAMEWORK_SVELTE_VITE = 'FRAMEWORK_SVELTE-VITE',
  FRAMEWORK_SVELTE_WEBPACK5 = 'FRAMEWORK_SVELTE-WEBPACK5',
  FRAMEWORK_SVELTEKIT = 'FRAMEWORK_SVELTEKIT',
  FRAMEWORK_VUE_VITE = 'FRAMEWORK_VUE-VITE',
  FRAMEWORK_VUE_WEBPACK5 = 'FRAMEWORK_VUE-WEBPACK5',
  FRAMEWORK_VUE3_VITE = 'FRAMEWORK_VUE3-VITE',
  FRAMEWORK_VUE3_WEBPACK5 = 'FRAMEWORK_VUE3-WEBPACK5',
  FRAMEWORK_WEB_COMPONENTS_VITE = 'FRAMEWORK_WEB-COMPONENTS-VITE',
  FRAMEWORK_WEB_COMPONENTS_WEBPACK5 = 'FRAMEWORK_WEB-COMPONENTS-WEBPACK5',
}

export class NxProjectDetectedError extends StorybookError {
  readonly category = Category.CLI_INIT;

  readonly code = 1;

  public readonly documentation = 'https://nx.dev/packages/storybook';

  template() {
    return dedent`
      We have detected Nx in your project. Nx has its own Storybook initializer, so please use it instead.
      Run "nx g @nx/storybook:configuration" to add Storybook to your project.
    `;
  }
}

export class MissingFrameworkFieldError extends StorybookError {
  readonly category = Category.CORE_COMMON;

  readonly code = 1;

  public readonly documentation =
    'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-framework-api';

  template() {
    return dedent`
      Could not find a 'framework' field in Storybook config.

      Please run 'npx storybook@next automigrate' to automatically fix your config.
    `;
  }
}

export class InvalidFrameworkNameError extends StorybookError {
  readonly category = Category.CORE_COMMON;

  readonly code = 2;

  public readonly documentation =
    'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-framework-api';

  constructor(public data: { frameworkName: string }) {
    super();
  }

  template() {
    return dedent`
      Invalid value of '${this.data.frameworkName}' in the 'framework' field of Storybook config.

      Please run 'npx storybook@next automigrate' to automatically fix your config.
    `;
  }
}

export class CouldNotEvaluateFrameworkError extends StorybookError {
  readonly category = Category.CORE_COMMON;

  readonly code = 3;

  constructor(public data: { frameworkName: string }) {
    super();
  }

  template() {
    return dedent`
      Could not evaluate the '${this.data.frameworkName}' package from the 'framework' field of Storybook config.

      Are you sure it's a valid package and is installed?
    `;
  }
}

export class ConflictingStaticDirConfigError extends StorybookError {
  readonly category = Category.CORE_SERVER;

  readonly code = 1;

  public readonly documentation =
    'https://storybook.js.org/docs/react/configure/images-and-assets#serving-static-files-via-storybook-configuration';

  template() {
    return dedent`
      Storybook encountered a conflict when trying to serve statics. You have configured both:
      * Storybook's option in the config file: 'staticDirs'
      * Storybook's (deprecated) CLI flag: '--staticDir' or '-s'
      
      Please remove the CLI flag from your storybook script and use only the 'staticDirs' option instead.
    `;
  }
}

export class InvalidStoriesEntryError extends StorybookError {
  readonly category = Category.CORE_COMMON;

  readonly code = 4;

  public readonly documentation =
    'https://storybook.js.org/docs/react/faq#can-i-have-a-storybook-with-no-local-stories';

  template() {
    return dedent`
      Storybook could not index your stories.
      Your main configuration somehow does not contain a 'stories' field, or it resolved to an empty array.

      Please check your main configuration file and make sure it exports a 'stories' field that is not an empty array.
    `;
  }
}

export class WebpackMissingStatsError extends StorybookError {
  readonly category = Category.BUILDER_WEBPACK5;

  readonly code = 1;

  public documentation = [
    'https://webpack.js.org/configuration/stats/',
    'https://storybook.js.org/docs/react/builders/webpack#configure',
  ];

  template() {
    return dedent`
      No Webpack stats found. Did you turn off stats reporting in your webpack config?
      Storybook needs Webpack stats (including errors) in order to build correctly.
    `;
  }
}

export class WebpackInvocationError extends StorybookError {
  readonly category = Category.BUILDER_WEBPACK5;

  readonly code = 2;

  private errorMessage = '';

  constructor(
    public data: {
      error: Error;
    }
  ) {
    super();
    this.errorMessage = data.error.message;
  }

  template() {
    return this.errorMessage.trim();
  }
}

function removeAnsiEscapeCodes(input = '') {
  // eslint-disable-next-line no-control-regex
  return input.replace(/\u001B\[[0-9;]*m/g, '');
}

export class WebpackCompilationError extends StorybookError {
  readonly category = Category.BUILDER_WEBPACK5;

  readonly code = 3;

  constructor(
    public data: {
      errors: {
        message: string;
        stack?: string;
        name?: string;
      }[];
    }
  ) {
    super();

    this.data.errors = data.errors.map((err) => {
      return {
        ...err,
        message: removeAnsiEscapeCodes(err.message),
        stack: removeAnsiEscapeCodes(err.stack),
        name: err.name,
      };
    });
  }

  template() {
    // This error message is a followup of errors logged by Webpack to the user
    return dedent`
      There were problems when compiling your code with Webpack.
      Run Storybook with --debug-webpack for more information.
    `;
  }
}

export class MissingAngularJsonError extends StorybookError {
  readonly category = Category.CLI_INIT;

  readonly code = 2;

  public readonly documentation =
    'https://storybook.js.org/docs/angular/faq#error-no-angularjson-file-found';

  constructor(
    public data: {
      path: string;
    }
  ) {
    super();
  }

  template() {
    return dedent`
      An angular.json file was not found in the current working directory: ${this.data.path}
      Storybook needs it to work properly, so please rerun the command at the root of your project, where the angular.json file is located.
    `;
  }
}

export class AngularLegacyBuildOptionsError extends StorybookError {
  readonly category = Category.FRAMEWORK_ANGULAR;

  readonly code = 1;

  public readonly documentation = [
    'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#angular-drop-support-for-calling-storybook-directly',
    'https://github.com/storybookjs/storybook/tree/next/code/frameworks/angular#how-do-i-migrate-to-an-angular-storybook-builder',
  ];

  template() {
    return dedent`
      Your Storybook startup script uses a solution that is not supported anymore.
      You must use Angular builder to have an explicit configuration on the project used in angular.json.

      Please run 'npx storybook@next automigrate' to automatically fix your config.
    `;
  }
}
