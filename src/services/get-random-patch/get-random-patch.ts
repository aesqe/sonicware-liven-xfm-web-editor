import initPatch from '../../assets/presets/initpatch.json'
import { getRandomizedOperatorValues } from '../../components/Operator/services/get-randomized-operator-values/get-randomized-operator-values'
import { XFMPatch, RandomizationOptions } from '../../types'

type Props = {
  basic?: boolean
  sourcePatch?: XFMPatch
  randomizationOptions: RandomizationOptions
}

export const getRandomPatch = (props: Props): XFMPatch => {
  const { basic = false, sourcePatch = initPatch, randomizationOptions } = props

  const random01 = getRandomizedOperatorValues(1, !basic, randomizationOptions, sourcePatch.OP1)
  const random02 = getRandomizedOperatorValues(2, !basic, randomizationOptions, sourcePatch.OP2)
  const random03 = getRandomizedOperatorValues(3, !basic, randomizationOptions, sourcePatch.OP3)
  const random04 = getRandomizedOperatorValues(4, !basic, randomizationOptions, sourcePatch.OP4)

  return {
    ...sourcePatch,
    OP1: {
      ...sourcePatch.OP1,
      ...random01.values,
      ...(!basic ? random01.adsrValues : {})
    },
    OP2: {
      ...sourcePatch.OP2,
      ...random02.values,
      ...(!basic ? random02.adsrValues : {})
    },
    OP3: {
      ...sourcePatch.OP3,
      ...random03.values,
      ...(!basic ? random03.adsrValues : {})
    },
    OP4: {
      ...sourcePatch.OP4,
      ...random04.values,
      ...(!basic ? random04.adsrValues : {})
    }
  }
}
