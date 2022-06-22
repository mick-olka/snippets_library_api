import CONFIG from '@/config'
import AppInformation from '@/types/Response/AppInformation'

/**
 * Get application information.
 *
 * @returns {AppInformation}
 */
// eslint-disable-next-line import/prefer-default-export
export const getAppInfo = (): AppInformation => CONFIG.APP
