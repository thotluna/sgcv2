import messages from '../messages/es.json'

export const factory = <K extends keyof typeof messages>(group: K) => {
  return (key: keyof (typeof messages)[K]) => messages[group][key]
}
