"""
This code is based on the Pokemon Card Generator project by pixegami.
Original project: https://github.com/pixegami/pokemon-card-generator
"""

import json
import os
import random
import sys
from PIL import Image, ImageFont, ImageDraw
import io
import os
from PIL import Image, ImageDraw, ImageFont
import requests
from supabase import StorageException, create_client, Client
from dotenv import load_dotenv
import supabase

# Load environment variables from a .env file
load_dotenv()
# Retrieve environment variables
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
# 
supabase: Client = create_client(url, key)



MONSTER_IMAGE_SCALE = 0.255
MONSTER_IMAGE_SCALE_SQ = 0.355
IDEAL_CARD_WIDTH = 450

ABILITY_WIDTH = 370
ABILITY_HEIGHT = 72
ABILITY_COST_WIDTH = 76
ABILITY_COST_GAP = 12
ELEMENT_SIZE = 30
ABILITY_GAP = 4
POWER_WIDTH = 64

STATUS_Y_POSITION = 568
STATUS_X_GAP = 82
STATUS_SIZE = 20

def render_generation(card_data):
    # with open(json_file, 'r') as f:
    #     card_data = json.load(f)
    evolvement = len(card_data) - 1
    for i in range(evolvement+1):
        card_image = render_card(card_data, str(i))
        img_byte_arr = io.BytesIO()
        card_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Upload the image to Supabase Storage
        try:
            file_name = card_data[str(i)]['name'].lower().replace(" ", "_")
            supabase.storage.from_('card/generated_cards').upload(f'{file_name}', img_byte_arr.read(), file_options={'content-type': 'image/png'})
            print(f"Card {card_data[str(i)]['name']} generated and uploaded successfully!")
        except StorageException as e:
            print(f"Exception during upload: {e}")
        # card_image.save(f"src/assets/cards/generated_cards/{card_data[str(i)]['image_file']}")
        print(f"Card {card_data[str(i)]['name']} generated successfully!")

def render_card(card_data, evolvement):
    # Load card json data
    # with open(json_file, 'r') as f:
    #     card_data = json.load(f)
    print(f"Rendering card {card_data[evolvement]['name']}...")

    # Load the template card based on the element
    card_template_name = f"{card_data[evolvement]['element']}_card.png"
    print(card_template_name)
    card_image = Image.open(f"src/assets/cards/{card_template_name}")

    # Create a blank canvas
    canvas = Image.new("RGBA", card_image.size, (0, 0, 0, 0))


    # Make a request to the image URL
    response = requests.get(card_data[evolvement]['image_url'])

    # Check if the request was successful
    if response.status_code == 200:
        # Open the image from the bytes in the response content
        artwork = Image.open(io.BytesIO(response.content))
    else:
        print(f"Failed to fetch image: {response.status_code}")

    # Resize the artwork to fit the card
    rescale_factor = IDEAL_CARD_WIDTH / artwork.width
    resized_image_shape = (
        int(artwork.width * rescale_factor),
        int(artwork.height * rescale_factor),
    )

    artwork = artwork.resize(resized_image_shape)

    card_center_x = card_image.size[0] / 2
    card_center_y = 210
    monster_image_x = card_center_x - (artwork.size[0] / 2)
    monster_image_y = card_center_y - (artwork.size[1] / 2)
    canvas.paste(artwork, (int(monster_image_x), int(monster_image_y)))
    canvas.paste(card_image, (0, 0), card_image)
    card_image = canvas

    # Write the name of the pokemon
    name_text_position = (48, 64)
    title_font = ImageFont.truetype("src/assets/font/Cabin-Bold.ttf", 28)
    name_text = card_data[evolvement]['name']

    # Draw the name text onto the card.
    draw = ImageDraw.Draw(card_image)
    draw.text(
        name_text_position, name_text, font=title_font, fill=(0, 0, 0), anchor="ls"
    )


     # Draw the HP on the card.
    hp_x_position = card_image.width - 86
    hp_y_position = 64
    hp_font = ImageFont.truetype("src/assets/font/Cabin_Condensed-Regular.ttf", 28)
    hp_text = f"{card_data[evolvement]['hp']} HP"
    draw.text(
        (hp_x_position, hp_y_position),
        hp_text,
        font=hp_font,
        fill=(255, 0, 0),
        anchor="rs",
    )


      # Draw the abilities on the card.
    ability_y_position_center = 450
    # Center the abilities on the card.
    ability_x_position = (card_image.width - ABILITY_WIDTH) // 2

    if len(card_data[evolvement]['abilities']) == 1:
        ability_y_origin = ability_y_position_center - (ABILITY_HEIGHT // 2)
    elif len(card_data[evolvement]['abilities']) == 2:
        ability_y_origin = ability_y_position_center - (
            ABILITY_HEIGHT + ABILITY_COST_GAP // 2
        )

    # Draw the abilities in reverse order so that the first ability is at the bottom.
    abilities = reversed(card_data[evolvement]['abilities'])
    for i, ability in enumerate(abilities):
        ability_image = render_ability(ability)
        ability_y = ability_y_origin + (i * (ABILITY_HEIGHT + ABILITY_COST_GAP))
        card_image.paste(
            ability_image,
            (int(ability_x_position), ability_y),
            ability_image,
        )

        ability_y_position_center += ABILITY_HEIGHT

    # Draw line between abilities.
    if len(card_data[evolvement]['abilities']) > 1:
        # Draw line between abilities.
        line_y = ability_y_origin + ABILITY_HEIGHT
        line_extension_gap = 36
        draw.line(
            (
                (line_extension_gap, line_y),
                (card_image.width - line_extension_gap, line_y),
            ),
            fill=(0, 0, 0),
            width=2,
        )

    # Render the status of the card (weakness, resistance, etc.)
    render_weakness_and_resist(card_data, card_image, evolvement)

    # Write the rarity of the Pokemon.
    rarity_text_position = (58, 602)
    rarity_font = ImageFont.truetype("src/assets/font/Cabin_Condensed-Regular.ttf", 18)
    rarity_text = f"{get_rarity_adjectives(card_data[evolvement]['rarity_index'], int(evolvement))} {card_data[evolvement]['element']}-type Card"
    draw.text(
        rarity_text_position,
        rarity_text.title(),
        font=rarity_font,
        fill=(0, 0, 0),
        anchor="lm",
    )

    # Write the rarity of the Pokemon.
    rarity_symbol_position = (card_image.width - 64, 605)
    symbol_font = ImageFont.truetype("src/assets/font/NotoSansSymbols2-Regular.ttf", 22)
    rarity_symbols = ["⬤", "◆", "★"]
    rarity_symbol_sizes = [10, 14, 22]

    symbol_text = rarity_symbols[card_data[str(evolvement)]['rarity_index']]
    symbol_font = ImageFont.truetype(
        "src/assets/font/NotoSansSymbols2-Regular.ttf",
        rarity_symbol_sizes[card_data[str(evolvement)]['rarity_index']],
    )

    draw.text(
        rarity_symbol_position,
        symbol_text,
        font=symbol_font,
        fill=(0, 0, 0),
        anchor="mm",
    )

    return card_image



def render_ability(ability):
    ability_image = Image.new("RGBA", (ABILITY_WIDTH, ABILITY_HEIGHT), (0, 0, 0, 0))
    cost_image = render_element_cost(ability['cost'], ability['element'], ability['is_mixed_element'])
    ability_image.paste(cost_image, (0, 0), cost_image)

    # Ability name description.
    name_text_position = (ABILITY_WIDTH // 2, ABILITY_HEIGHT // 2)
    name_font = ImageFont.truetype("src/assets/font/Cabin-Bold.ttf", 24)
    name_text = ability['name']
    draw = ImageDraw.Draw(ability_image)
    draw.text(
        name_text_position, name_text, font=name_font, fill=(0, 0, 0), anchor="mm"
    )

    # Draw the ability power text.
    power_text_position = (ABILITY_WIDTH - 12, ABILITY_HEIGHT // 2)
    power_font = ImageFont.truetype("src/assets/font/Cabin_Condensed-Regular.ttf", 32)
    power_text = str(ability['power'])
    draw.text(
        power_text_position,
        power_text,
        font=power_font,
        fill=(0, 0, 0),
        anchor="rm",
    )
    return ability_image


def render_element_cost(cost, element_type, is_mixed_element):
    cost_canvas = Image.new(
        "RGBA", (ABILITY_COST_WIDTH, ABILITY_HEIGHT), (255, 255, 255, 0)
    )

    icon_positions = []

    # If there are two icons, they are centered and 20 pixels apart.
    # If there are three icons, they are in a triangle.
    # If there are four icons, they are in a square.

    # Work out the positions of the icons based on the number of icons.

    center_x = ABILITY_COST_WIDTH // 2
    center_y = ABILITY_HEIGHT // 2
    x_offset = center_x - (ELEMENT_SIZE // 2 + ABILITY_GAP // 2)
    x_offset_down = x_offset + ELEMENT_SIZE + ABILITY_GAP
    y_offset = center_y - (ELEMENT_SIZE + ABILITY_GAP) // 2
    y_offset_down = y_offset + ELEMENT_SIZE + ABILITY_GAP

    if cost == 1:
        # If there is only one icon, it is centered.
        icon_positions.append((center_x, center_y))
    elif cost == 2:
        icon_positions.append((x_offset, center_y))
        icon_positions.append((x_offset_down, center_y))
    elif cost == 3:
        icon_positions.append((x_offset, y_offset))
        icon_positions.append((x_offset_down, y_offset))
        icon_positions.append((center_x, y_offset_down))

    elif cost == 4:
        icon_positions.append((x_offset, y_offset))
        icon_positions.append((x_offset_down, y_offset))
        icon_positions.append((x_offset, y_offset_down))
        icon_positions.append((x_offset_down, y_offset_down))

    elif cost == 5:
        icon_positions.append((x_offset, y_offset))
        icon_positions.append((x_offset_down, y_offset))
        icon_positions.append((x_offset, y_offset_down))
        icon_positions.append((x_offset_down, y_offset_down))

    elif cost == 6:
        icon_positions.append((x_offset, y_offset))
        icon_positions.append((x_offset_down, y_offset))
        icon_positions.append((x_offset, y_offset_down))
        icon_positions.append((x_offset_down, y_offset_down))

    # Randomize the elements icons based on is_mixed_elements
    if is_mixed_element == "mixed":
        elements = []
        for i in range(cost):
            if random.choice([True, False]):
                elements.append(element_type)
            else:
                elements.append("neutral")
    else:
        elements = [element_type] * cost



    draw = ImageDraw.Draw(cost_canvas)
    for i, element in enumerate(elements):
        # Draw circles for each element.
        if i < len(icon_positions):  # Ensure we don't exceed the number of positions
            element_image = Image.open(f"src/assets/elements/{element.lower()}_element.png")
            element_image = element_image.resize((ELEMENT_SIZE, ELEMENT_SIZE))
            cost_canvas.paste(
                element_image,
                (
                    icon_positions[i][0] - ELEMENT_SIZE // 2,
                    icon_positions[i][1] - ELEMENT_SIZE // 2,
                ),
                element_image,
            )

    return cost_canvas

def render_weakness_and_resist(card_data, image: Image, evolvement: int):
    resist_element = get_resist(card_data[str(evolvement)]['element'])
    weakness_element = get_weakness(card_data[str(evolvement)]['element'])

    if weakness_element:
        weakness_x = STATUS_X_GAP
        render_status_element(image, weakness_element, weakness_x)

    if resist_element:
        resist_x = image.width // 2
        render_status_element(image, resist_element, resist_x)

    retreat_cost_gap = image.width - STATUS_X_GAP
    render_status_element(image, "neutral", retreat_cost_gap)


def render_status_element(image: Image, element, x_position: int):
    element_image = Image.open(f"src/assets/elements/{element.lower()}_element.png")
    element_image = element_image.resize((STATUS_SIZE, STATUS_SIZE))
    image.paste(
        element_image,
        (
            x_position - STATUS_SIZE // 2,
            STATUS_Y_POSITION - STATUS_SIZE // 2,
        ),
        element_image,
    )


def get_resist(element: str) -> str:
    if element.lower() == "fire":
        return "grass"
    elif element.lower() == "water":
        return "fire"
    elif element.lower() == "grass":
        return "electric"
    elif element.lower() == "psychic":
        return "fighting"
    else:
        return None


def get_weakness(element: str) -> str:
    if element.lower() == "fire":
        return "water"
    elif element.lower() == "water":
        return "electric"
    elif element.lower() == "grass":
        return "fire"
    elif element.lower() == "electric":
        return "fighting"
    elif element.lower() == "neutral":
        return "fighting"
    elif element.lower() == "fighting":
        return "psychic"
    else:
        return None

def get_rarity_adjectives(rarity_index, evolvement):
    print(evolvement)
    if rarity_index == 0:
        return ["common", "uncommon", "rare"][int(evolvement)]
    elif rarity_index == 1:
        return ["very rare", "special", "strong"][int(evolvement)]
    elif rarity_index == 2:
        return ["mythical", "epic", "legendary"][int(evolvement)]
    else:
        return [""]


def main():
    # import sys
    # if len(sys.argv) != 2:
    #     print("Usage: python render_card.py <json_file>")
    #     return

    # json_file = sys.argv[1]
    input_data = sys.stdin.read()
    cards = json.loads(input_data)
    render_generation(cards)
    

if __name__ == "__main__":
    main()

