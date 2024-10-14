import _ from 'lodash'

export const sentenceCase = (input: string) => _.startCase(_.toLower(input))
