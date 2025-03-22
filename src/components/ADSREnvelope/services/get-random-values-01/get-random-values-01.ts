export const getRandomValues01 = (pitchEnvelope: boolean) => ({
  ATime: Math.random(),
  ALevel: Math.random(),
  DTime: Math.random(),
  DLevel: Math.random(),
  SLevel: Math.random(),
  STime: Math.random(),
  RLevel: Math.random(),
  RTime: Math.random(),
  UpCurve: pitchEnvelope ? 0.5 : Math.random(),
  DnCurve: pitchEnvelope ? 0.5 : Math.random()
})
