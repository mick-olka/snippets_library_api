import AppInformation from '@/types/response/AppInformation'
import CONFIG from '@/config'

/**
 * Get application information.
 *
 * @returns {AppInformation}
 */
// eslint-disable-next-line import/prefer-default-export
export const getAppInfo = (): AppInformation => CONFIG.APP
