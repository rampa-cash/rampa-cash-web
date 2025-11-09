/**
 * Para Authentication Adapter
 *
 * Infrastructure layer - implements the auth port using Para SDK
 */

export { ParaAdapter } from './ParaAdapter';
export { ParaContextProvider, useParaContext } from './ParaContext';
export {
    getParaConfig,
    getParaModalConfig,
} from './para.config';
export type { ParaConfig, ParaModalConfig } from './para.config';
