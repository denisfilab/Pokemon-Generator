export class Card {
  index: number
  name: string
  description: string
  element: string
  evolvement: number
  rarity_index: number
  hp: number
  abilities: Ability[]
  image_prompt: string
  image_url?: string
  image_file?: string

  constructor(
    index: number,
    name: string,
    description: string,
    element: string,
    evolvement: number,
    rarity_index: number,
    hp: number,
    image_prompt: string
  ) {
    this.index = index
    this.name = name
    this.description = description
    this.element = element
    this.evolvement = evolvement
    this.rarity_index = rarity_index
    this.hp = hp
    this.abilities = []
    this.image_prompt = image_prompt
  }
}

export class Ability {
  name: string
  description: string
  element: string
  cost: number
  is_mixed_element: boolean
  power: number

  constructor(
    name: string,
    element: string,
    description: string,
    cost: number,
    is_mixed_element: boolean,
    power: number
  ) {
    this.name = name
    this.description = description
    this.element = element
    this.cost = cost
    this.is_mixed_element = is_mixed_element
    this.power = power
  }
}
