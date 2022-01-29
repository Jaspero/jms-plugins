import { InjectionToken } from "@angular/core";
import { GithubIssuesOptions } from "./interfaces/github-issues-options.interface";

export const OPTIONS = new InjectionToken<GithubIssuesOptions>('GH_ISSUES_OPTIONS');
