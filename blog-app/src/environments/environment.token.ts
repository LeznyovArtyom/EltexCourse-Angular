import { InjectionToken } from "@angular/core";
import { IEnvironmentConfig } from "./environment.interface";

export const ENV_CONFIF = new InjectionToken<IEnvironmentConfig>('ENV_CONFIG');